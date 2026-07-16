"""
Reads nearest_star_systems.json and writes real-stars.ts —
a TypeScript export of System[] using real Gaia star data,
with procedurally generated planets for every star.
"""

import json
import random
import math

INPUT  = "nearest_star_systems.json"
OUTPUT = "real-stars.ts"

PLANET_TYPES = [
    "Rocky", "Temperate", "Ocean", "Frozen",
    "Lava", "Gas", "Desert", "Greenhouse",
]

PLANET_SUFFIXES = ["1", "2", "3", "4", "5"]

RESOURCES = [
    "Iron", "Copper", "Titanium", "Silica", "Carbon",
    "Helium-3", "Ice", "Sulfur", "Uranium", "Gold",
    "Platinum", "Lithium", "Nickel", "Cobalt", "Aluminium",
]


def temp_to_star_type(temp_k):
    if temp_k is None:
        return "Red-Dwarf"
    if temp_k < 3700:
        return "Red-Dwarf"
    if temp_k < 5300:
        return "Brown-Dwarf"   # K-type orange dwarf
    if temp_k < 6000:
        return "Yellow-Dwarf"
    if temp_k < 7500:
        return "White-Dwarf"
    if temp_k < 25000:
        return "Blue-Giant"
    return "Red-Supergiant"


def temp_to_color(temp_k):
    """Approximate perceptual blackbody color as hex."""
    if temp_k is None:
        return None
    if temp_k < 2600:
        return "#ff2200"   # deep red
    if temp_k < 3000:
        return "#ff4400"   # red
    if temp_k < 3500:
        return "#ff6622"   # orange-red
    if temp_k < 4000:
        return "#ff8833"   # orange
    if temp_k < 4500:
        return "#ffaa55"   # light orange
    if temp_k < 5000:
        return "#ffcc88"   # pale orange-yellow
    if temp_k < 5500:
        return "#ffddaa"   # yellow-white
    if temp_k < 6000:
        return "#fff2cc"   # warm white (Sun-like)
    if temp_k < 7500:
        return "#ffffff"   # white
    if temp_k < 10000:
        return "#cce0ff"   # blue-white
    return "#aac0ff"       # blue


def magnitude_to_color(mag):
    """Rough color estimate when temperature is unavailable, based on Gaia G magnitude."""
    if mag is None:
        return "#ff5500"
    if mag > 10:
        return "#ff3300"   # very faint → deep red dwarf
    if mag > 8:
        return "#ff5500"   # faint → red dwarf
    if mag > 6:
        return "#ff8833"   # moderate → orange dwarf
    if mag > 4:
        return "#ffcc88"   # brighter → K-type
    return "#fff2cc"       # bright → G-type or better


def slot_count_for_class(planet_class):
    base = planet_class.rstrip("12345")
    if base in ("Temperate", "Ocean", "Greenhouse"):
        return random.randint(5, 8)
    if base in ("Desert", "Rocky", "Frozen"):
        return random.randint(3, 5)
    if base in ("Lava", "Gas"):
        return random.randint(2, 3)
    return 2


def ra_dec_to_xyz(ra_deg, dec_deg, dist_ly, scale=90):
    """
    Convert RA/Dec/distance to cartesian, then scale to the
    game's coordinate range (roughly -20..90 per axis).
    Uses the actual 3D position relative to Sol so nearby
    stars cluster realistically.
    Max distance in dataset is ~32.6 ly; we normalise to that.
    """
    max_dist = 32.6
    ra  = math.radians(ra_deg)
    dec = math.radians(dec_deg)
    d   = dist_ly / max_dist  # 0..1

    x_raw = d * math.cos(dec) * math.cos(ra)
    y_raw = d * math.cos(dec) * math.sin(ra)
    z_raw = d * math.sin(dec)

    # Map -1..1 → 0..scale, then shift so Sol is near centre
    def remap(v):
        return int((v + 1) / 2 * scale) - scale // 4

    return remap(x_raw), remap(y_raw), remap(z_raw)


def make_planet(system_name, index, planet_class=None):
    if planet_class is None:
        planet_class = random.choice(PLANET_TYPES) + random.choice(PLANET_SUFFIXES)
    name = f"{system_name}-{index + 1}"
    slots = slot_count_for_class(planet_class)
    r1 = random.choice(RESOURCES)
    r2 = random.choice([r for r in RESOURCES if r != r1])
    return {
        "name": name,
        "class": planet_class,
        "naturalResources": [r1, r2],
        "buildings": [],
        "resourceStorage": [],
        "production": [],
        "orbit": [],
        "hangar": [],
        "populationSlots": [
            {"slotId": i, "occupant": None} for i in range(slots)
        ],
    }


def make_positions(system_name, planet_names):
    positions = {}
    for planet in planet_names:
        for i in range(1, 9):
            positions[f"{planet}-orbit-{i}"] = None
    for i in range(1, 21):
        positions[f"{system_name}-above-{i}"] = None
    for i in range(1, 21):
        positions[f"{system_name}-below-{i}"] = None
    for i in range(1, 51):
        positions[f"{system_name}-outer-{i}"] = None
    return positions


def star_name(gaia_id, index):
    """Produce a stable, readable system name from Gaia source_id."""
    # Use last 4 digits + alphabetic index suffix for uniqueness
    suffix = chr(ord('A') + (index % 26))
    short  = str(gaia_id)[-4:]
    return f"GJ-{short}{suffix}"


def build_system(star, index):
    name     = star_name(star["gaia_id"], index)
    temp     = star["star"].get("temperature_kelvin")
    mag      = star["star"].get("magnitude")
    star_typ = temp_to_star_type(temp)
    color    = temp_to_color(temp) or magnitude_to_color(mag)

    ra  = star["coordinates"]["ra"]
    dec = star["coordinates"]["dec"]
    dist = star["distance_light_years"]
    x, y, z = ra_dec_to_xyz(ra, dec, dist)
    cords = f"R-{x}_{y}_{z}"

    planet_count = random.randint(1, 7)
    planets = [make_planet(name, i) for i in range(planet_count)]
    planet_names = [p["name"] for p in planets]

    system = {
        "systemName": name,
        "systemStar": star_typ,
        "cords": cords,
        "systemPlanets": planets,
        "positions": make_positions(name, planet_names),
        "activePlanet": {
            "name": "", "class": "", "naturalResources": [],
            "buildings": [], "resourceStorage": [], "production": [],
            "hangar": [], "orbit": [], "populationSlots": [],
        },
        "starColor": color,
    }
    if mag is not None:
        system["starMagnitude"] = mag
    return system


def to_ts(obj, indent=0):
    pad  = "  " * indent
    pad1 = "  " * (indent + 1)

    if obj is None:
        return "null"
    if isinstance(obj, float) and math.isnan(obj):
        return "null"
    if isinstance(obj, bool):
        return "true" if obj else "false"
    if isinstance(obj, (int, float)):
        return str(obj)
    if isinstance(obj, str):
        escaped = obj.replace("\\", "\\\\").replace('"', '\\"')
        return f'"{escaped}"'
    if isinstance(obj, list):
        if not obj:
            return "[]"
        items = [f"{pad1}{to_ts(v, indent + 1)}" for v in obj]
        return "[\n" + ",\n".join(items) + f"\n{pad}]"
    if isinstance(obj, dict):
        if not obj:
            return "{}"
        items = [f'{pad1}"{k}": {to_ts(v, indent + 1)}' for k, v in obj.items()]
        return "{\n" + ",\n".join(items) + f"\n{pad}}}"
    return str(obj)


def main():
    with open(INPUT, encoding="utf-8") as f:
        stars = json.load(f)

    systems = [build_system(s, i) for i, s in enumerate(stars)]

    ts_lines = [
        "// Auto-generated by build_real_stars.py — do not edit by hand.",
        "// 100 nearest real star systems from Gaia DR3.",
        'import type { System } from "./generate-sector";',
        "",
        f"export const realStars: System[] = {to_ts(systems)};",
        "",
    ]

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write("\n".join(ts_lines))

    print(f"Wrote {len(systems)} systems to {OUTPUT}")


if __name__ == "__main__":
    main()
