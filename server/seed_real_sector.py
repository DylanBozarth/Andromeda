"""
Builds a sector from the 100 nearest real stars (Gaia DR3 data),
fetches proper names from SIMBAD, then writes the sector to the
PostgreSQL database, replacing the existing sector-a row.

Run from the server/ directory:
    python seed_real_sector.py
"""

import asyncio
import json
import math
import random
import sys
from pathlib import Path

# ── add server root to path so we can import the ORM ─────────────────────────
sys.path.insert(0, str(Path(__file__).parent))

from astroquery.simbad import Simbad
from astropy.coordinates import SkyCoord
import astropy.units as u

from database.database import engine, SessionLocal, Base
from database.models import Sector

# ── data files ────────────────────────────────────────────────────────────────
STAR_JSON = Path(__file__).parent.parent / "src/utils/system-generator/nearest_star_systems.json"

SECTOR_NAME = "sector-a"

PLANET_TYPES  = ["Rocky", "Temperate", "Ocean", "Frozen", "Lava", "Gas", "Desert", "Greenhouse"]
PLANET_SUFFIX = ["1", "2", "3", "4", "5"]
RESOURCES     = ["Iron", "Copper", "Titanium", "Silica", "Carbon", "Helium-3",
                  "Ice", "Sulfur", "Uranium", "Gold", "Platinum", "Lithium",
                  "Nickel", "Cobalt", "Aluminium"]
NCO_TYPES     = ["Black-hole", "Nebula", "Asteroid-cluster", "Pulsar", "Magnetar"]


# ── helpers ───────────────────────────────────────────────────────────────────

def safe_float(v):
    try:
        f = float(v)
        return None if math.isnan(f) else f
    except Exception:
        return None


def temp_to_star_type(t):
    if t is None:   return "Red-Dwarf"
    if t < 3700:    return "Red-Dwarf"
    if t < 5300:    return "Brown-Dwarf"
    if t < 6000:    return "Yellow-Dwarf"
    if t < 7500:    return "White-Dwarf"
    if t < 25000:   return "Blue-Giant"
    return "Red-Supergiant"


def temp_to_color(t):
    if t is None:   return None
    if t < 2600:    return "#ff2200"
    if t < 3000:    return "#ff4400"
    if t < 3500:    return "#ff6622"
    if t < 4000:    return "#ff8833"
    if t < 4500:    return "#ffaa55"
    if t < 5000:    return "#ffcc88"
    if t < 5500:    return "#ffddaa"
    if t < 6000:    return "#fff2cc"
    if t < 7500:    return "#ffffff"
    if t < 10000:   return "#cce0ff"
    return "#aac0ff"


def mag_to_color(mag):
    if mag is None: return "#ff5500"
    if mag > 10:    return "#ff3300"
    if mag > 8:     return "#ff5500"
    if mag > 6:     return "#ff8833"
    if mag > 4:     return "#ffcc88"
    return "#fff2cc"


def ra_dec_to_coords(ra_deg, dec_deg, dist_ly):
    """Map real 3-D stellar position to game coordinate space."""
    max_dist = 32.6
    ra  = math.radians(ra_deg)
    dec = math.radians(dec_deg)
    d   = dist_ly / max_dist

    x_raw = d * math.cos(dec) * math.cos(ra)
    y_raw = d * math.cos(dec) * math.sin(ra)
    z_raw = d * math.sin(dec)

    def remap(v):
        return int((v + 1) / 2 * 90) - 22

    x, y, z = remap(x_raw), remap(y_raw), remap(z_raw)
    return f"R-{x}_{y}_{z}", x, y


def slot_count(planet_class):
    base = planet_class.rstrip("12345")
    if base in ("Temperate", "Ocean", "Greenhouse"): return random.randint(5, 8)
    if base in ("Desert", "Rocky", "Frozen"):        return random.randint(3, 5)
    if base in ("Lava", "Gas"):                      return random.randint(2, 3)
    return 2


def make_planet(system_name, idx):
    cls  = random.choice(PLANET_TYPES) + random.choice(PLANET_SUFFIX)
    name = f"{system_name}-{idx + 1}"
    r1   = random.choice(RESOURCES)
    r2   = random.choice([r for r in RESOURCES if r != r1])
    return {
        "name": name,
        "class": cls,
        "naturalResources": [r1, r2],
        "buildings": [],
        "resourceStorage": [],
        "production": [],
        "orbit": [],
        "hangar": [],
        "populationSlots": [{"slotId": i, "occupant": None} for i in range(slot_count(cls))],
    }


def make_positions(system_name, planet_names):
    pos = {}
    for p in planet_names:
        for i in range(1, 9):
            pos[f"{p}-orbit-{i}"] = None
    for i in range(1, 21):
        pos[f"{system_name}-above-{i}"] = None
    for i in range(1, 21):
        pos[f"{system_name}-below-{i}"] = None
    for i in range(1, 51):
        pos[f"{system_name}-outer-{i}"] = None
    return pos


def make_nco_positions(nco_name):
    pos = {}
    for i in range(1, 51):
        pos[f"{nco_name}-outer-{i}"] = None
    for i in range(1, 21):
        pos[f"{nco_name}-inner-{i}"] = None
    return pos


def distance_2d(x1, y1, x2, y2):
    return round(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2))


def time_scale_eta(dist):
    return str((dist * 15) / 60)


def generate_ncos(n=75):
    ncos = []
    for i in range(n):
        name = f"a-{random.randint(100000, 999999)}"
        x    = random.randint(-20, 90)
        y    = random.randint(-10, 90)
        z    = random.randint(-20, 90)
        ncos.append({
            "type":      random.choice(NCO_TYPES),
            "name":      name,
            "effect":    "10 damage",
            "cords":     f"A-{x}_{y}_{z}",
            "fleets":    [],
            "positions": make_nco_positions(name),
        })
    return ncos


# ── known star name lookup (distance-based, avoids SIMBAD failures) ──────────
# Maps approximate distance (ly) to well-known name(s). Matched within ±0.3 ly.
KNOWN_STARS = [
    (4.24,  "Proxima-Centauri"),
    (4.37,  "Alpha-Centauri-A"),
    (4.37,  "Alpha-Centauri-B"),
    (5.96,  "Barnards-Star"),
    (7.78,  "Wolf-359"),
    (8.29,  "Lalande-21185"),
    (8.58,  "Sirius-A"),
    (8.58,  "Sirius-B"),
    (8.73,  "Luyten-726-8A"),
    (8.73,  "Luyten-726-8B"),
    (9.68,  "Ross-154"),
    (10.32, "Ross-248"),
    (10.52, "Epsilon-Eridani"),
    (10.74, "Lacaille-9352"),
    (10.92, "Ross-128"),
    (11.27, "EZ-Aquarii-A"),
    (11.40, "61-Cygni-A"),
    (11.40, "61-Cygni-B"),
    (11.47, "Procyon-A"),
    (11.47, "Procyon-B"),
    (11.52, "Struve-2398-A"),
    (11.62, "Groombridge-34-A"),
    (11.83, "Epsilon-Indi-A"),
    (11.91, "DX-Cancri"),
    (11.99, "Tau-Ceti"),
    (12.10, "GJ-1061"),
    (12.14, "YZ-Ceti"),
    (12.50, "Luyten-Star"),
    (12.83, "Teegarden-Star"),
    (13.16, "Kapteyn-Star"),
    (13.85, "Lacaille-8760"),
]


def name_from_known(dist_ly):
    """Return a well-known name if dist_ly matches a known entry within ±0.3 ly."""
    for known_dist, name in KNOWN_STARS:
        if abs(dist_ly - known_dist) <= 0.3:
            return name
    return None


# ── SIMBAD name lookup ────────────────────────────────────────────────────────

def fetch_simbad_names(stars):
    """
    For each star, try distance-based known-name lookup first, then SIMBAD.
    Falls back to GJ-XXXX if nothing matches.
    Returns a list of name strings parallel to `stars`.
    """
    simbad = Simbad()
    simbad.add_votable_fields("ids")

    used_known = set()
    names = []

    for i, star in enumerate(stars):
        ra   = star["coordinates"]["ra"]
        dec  = star["coordinates"]["dec"]
        dist = star["distance_light_years"]
        fallback = f"GJ-{str(star['gaia_id'])[-4:]}{chr(ord('A') + i % 26)}"

        # 1. Distance-based known star
        known = name_from_known(dist)
        if known and known not in used_known:
            used_known.add(known)
            names.append(known)
            print(f"  [{i+1}/100] {known} ({dist:.2f} ly) [known]")
            continue

        # 2. SIMBAD coordinate query
        try:
            coord  = SkyCoord(ra=ra * u.deg, dec=dec * u.deg, frame="icrs")
            result = simbad.query_region(coord, radius=30 * u.arcsec)

            if result is None or len(result) == 0:
                names.append(fallback)
                print(f"  [{i+1}/100] {fallback} (no match, {dist:.2f} ly)")
                continue

            # Column name varies by astroquery version
            main_id_col = next((c for c in result.colnames if c.lower() == "main_id"), None)
            ids_col     = next((c for c in result.colnames if c.lower() == "ids"), None)

            raw_ids  = str(result[ids_col][0]) if ids_col else ""
            id_list  = [s.strip() for s in raw_ids.split("|")]

            chosen = None
            for prefix in ("NAME ", "GJ ", "Gl ", "HIP ", "HD "):
                for ident in id_list:
                    if ident.startswith(prefix):
                        chosen = ident.replace("NAME ", "").strip()
                        break
                if chosen:
                    break

            if not chosen and main_id_col:
                chosen = str(result[main_id_col][0]).strip()

            if not chosen:
                chosen = fallback

            chosen = chosen.replace(" ", "-").replace("*", "").replace(".", "").strip("-")
            if not chosen:
                chosen = fallback

            # De-duplicate: if this name is already taken, append a counter
            if chosen in used_known:
                base, n = chosen, 2
                while f"{base}-{n}" in used_known:
                    n += 1
                chosen = f"{base}-{n}"
            used_known.add(chosen)

            names.append(chosen)
            print(f"  [{i+1}/100] {chosen} ({dist:.2f} ly)")

        except Exception as e:
            names.append(fallback)
            print(f"  [{i+1}/100] {fallback} (error: {e})")

    return names


# ── sector builder ────────────────────────────────────────────────────────────

SOL_PLANETS = [
    {"name": "Mercury",       "class": "Rocky1",      "resources": ["Iron", "Silica"],    "slots": 2},
    {"name": "Venus",         "class": "Greenhouse1", "resources": ["Sulfur", "Carbon"],  "slots": 2},
    {"name": "Earth",         "class": "Temperate1",  "resources": ["Iron", "Ice"],        "slots": 8},
    {"name": "Mars",          "class": "Desert1",     "resources": ["Iron", "Silica"],    "slots": 3},
    {"name": "Asteroid-Belt", "class": "Rocky3",      "resources": ["Iron", "Nickel"],    "slots": 2},
    {"name": "Jupiter",       "class": "Gas1",        "resources": ["Helium-3", "Carbon"],"slots": 2},
    {"name": "Saturn",        "class": "Gas2",        "resources": ["Helium-3", "Ice"],   "slots": 2},
    {"name": "Uranus",        "class": "Frozen1",     "resources": ["Ice", "Methane"],    "slots": 2},
    {"name": "Neptune",       "class": "Frozen2",     "resources": ["Ice", "Nitrogen"],   "slots": 2},
]


def make_sol_system():
    """Sol at coordinate origin (distance = 0 ly)."""
    name = "Sol"
    # At dist=0: x_raw=y_raw=z_raw=0 → remap(0) = int(45) - 22 = 23
    cords = "R-23_23_23"
    x, y  = 23, 23

    planets = []
    for p in SOL_PLANETS:
        r1, r2 = p["resources"]
        planets.append({
            "name": p["name"],
            "class": p["class"],
            "naturalResources": [r1, r2],
            "buildings": [],
            "resourceStorage": [],
            "production": [],
            "orbit": [],
            "hangar": [],
            "populationSlots": [{"slotId": i, "occupant": None} for i in range(p["slots"])],
        })

    planet_names = [p["name"] for p in planets]
    return {
        "systemName":   name,
        "systemStar":   "Yellow-Dwarf",
        "cords":        cords,
        "systemPlanets": planets,
        "positions":    make_positions(name, planet_names),
        "starColor":    "#fff5cc",
        "starMagnitude": 4.83,
        "activePlanet": {
            "name": "", "class": "", "naturalResources": [],
            "buildings": [], "resourceStorage": [], "production": [],
            "hangar": [], "orbit": [], "populationSlots": [],
        },
    }, x, y


def build_sector(stars, names):
    systems    = []
    coord_map  = {}   # name → (x, y) for distance map

    # Sol goes first, at the center
    sol, sol_x, sol_y = make_sol_system()
    systems.append(sol)
    coord_map["Sol"] = (sol_x, sol_y)

    for i, (star, name) in enumerate(zip(stars, names)):
        temp = safe_float(star["star"].get("temperature_kelvin"))
        mag  = safe_float(star["star"].get("magnitude"))
        dist = star["distance_light_years"]

        ra  = star["coordinates"]["ra"]
        dec = star["coordinates"]["dec"]

        cords, x, y = ra_dec_to_coords(ra, dec, dist)
        coord_map[name] = (x, y)

        color = temp_to_color(temp) or mag_to_color(mag)

        planet_count = random.randint(1, 7)
        planets      = [make_planet(name, j) for j in range(planet_count)]
        planet_names = [p["name"] for p in planets]

        system = {
            "systemName":   name,
            "systemStar":   temp_to_star_type(temp),
            "cords":        cords,
            "systemPlanets": planets,
            "positions":    make_positions(name, planet_names),
            "starColor":    color,
            "activePlanet": {
                "name": "", "class": "", "naturalResources": [],
                "buildings": [], "resourceStorage": [], "production": [],
                "hangar": [], "orbit": [], "populationSlots": [],
            },
        }
        if mag is not None:
            system["starMagnitude"] = mag

        systems.append(system)

    # distance map (2-D, same as TypeScript calculateDistance)
    distances_map = {}
    for sys_a in systems:
        n_a          = sys_a["systemName"]
        x1, y1       = coord_map[n_a]
        distances_map[n_a] = {}
        for sys_b in systems:
            n_b = sys_b["systemName"]
            if n_b == n_a:
                continue
            x2, y2 = coord_map[n_b]
            d = distance_2d(x1, y1, x2, y2)
            distances_map[n_a][n_b] = {"distance": d, "eta": time_scale_eta(d)}

        # sort by distance ascending
        distances_map[n_a] = dict(
            sorted(distances_map[n_a].items(), key=lambda kv: kv[1]["distance"])
        )

    ncos = generate_ncos(75)

    return {
        "sectorName":     SECTOR_NAME,
        "systems":        systems,
        "distancesMap":   distances_map,
        "NCO":            ncos,
        "fleetsInTransit": [],
    }


# ── database writer ───────────────────────────────────────────────────────────

async def upsert_sector(sector_data):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        existing = await db.get(Sector, SECTOR_NAME)
        if existing:
            existing.systems        = sector_data["systems"]
            existing.distances_map  = sector_data["distancesMap"]
            existing.nco            = sector_data["NCO"]
            existing.fleets_in_transit = sector_data["fleetsInTransit"]
            print(f"Updated existing sector '{SECTOR_NAME}'.")
        else:
            db.add(Sector(
                name            = SECTOR_NAME,
                systems         = sector_data["systems"],
                distances_map   = sector_data["distancesMap"],
                nco             = sector_data["NCO"],
                fleets_in_transit = sector_data["fleetsInTransit"],
            ))
            print(f"Inserted new sector '{SECTOR_NAME}'.")

        await db.commit()


# ── main ──────────────────────────────────────────────────────────────────────

async def main():
    print("Loading star data...")
    stars = json.loads(STAR_JSON.read_text())
    print(f"  {len(stars)} stars loaded.")

    print("Fetching names from SIMBAD...")
    names = fetch_simbad_names(stars)

    print("Building sector...")
    sector = build_sector(stars, names)

    # also write out updated example-sector.json for reference
    out_path = Path(__file__).parent.parent / "example-sector.json"
    out_path.write_text(json.dumps(sector, indent=2, ensure_ascii=False))
    print(f"Wrote {out_path}")

    print("Writing to database...")
    await upsert_sector(sector)

    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
