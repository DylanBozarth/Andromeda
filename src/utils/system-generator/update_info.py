import json
import random
import requests
import pandas as pd
from astroquery.gaia import Gaia
from astroquery.simbad import Simbad


OUTPUT = "nearest_star_systems.json"

PLANET_TYPES = [
    "rocky",
    "lava",
    "frozen",
    "gas_giant",
    "greenhouse",
    "ocean"
]


def classify_planet(radius, mass, temperature):
    """
    Best-effort classification.
    Unknown planets get a random category.
    """

    try:
        radius = float(radius)
    except:
        radius = None

    try:
        temperature = float(temperature)
    except:
        temperature = None

    if temperature:
        if temperature > 1200:
            return "lava"
        if temperature < 170:
            return "frozen"
        if 700 < temperature < 1000:
            return "greenhouse"

    if radius:
        if radius < 1.8:
            return "rocky"
        if radius > 6:
            return "gas_giant"

    return random.choice(PLANET_TYPES)


def get_nearest_stars(limit=100):

    query = """
    SELECT TOP 100
        source_id,
        ra,
        dec,
        parallax,
        teff_gspphot,
        phot_g_mean_mag
    FROM gaiadr3.gaia_source
    WHERE parallax > 100
    ORDER BY parallax DESC
    """

    job = Gaia.launch_job(query)
    table = job.get_results()

    stars = []

    for row in table:

        if row["parallax"] is None:
            continue

        distance_pc = 1000 / float(row["parallax"])

        stars.append({
            "gaia_id": str(row["source_id"]),
            "distance_light_years": round(
                distance_pc * 3.26156,
                3
            ),
            "coordinates": {
                "ra": float(row["ra"]),
                "dec": float(row["dec"])
            },
            "star": {
                "temperature_kelvin":
                    safe_float(row["teff_gspphot"]),

                "magnitude":
                    safe_float(row["phot_g_mean_mag"])
            },
            "planets": [],
            "asteroid_belt": None
        })

    return stars[:limit]


def get_exoplanets():

    url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_orbper,pl_eqt+from+pscomppars&format=json"

    response = requests.get(url)
    response.raise_for_status()

    return response.json()


def attach_planets(stars, planets):

    lookup = {}

    for star in stars:
        lookup[star["gaia_id"]] = star

    for planet in planets:

        name = planet.get("hostname")

        # Matching by name is imperfect.
        # Gaia/HIP crossmatching can be added later.

        for star in stars:

            if name.lower() in star.get("name", "").lower():

                star["planets"].append({
                    "name": planet["pl_name"],
                    "mass_earth":
                        safe_float(planet["pl_bmasse"]),
                    "radius_earth":
                        safe_float(planet["pl_rade"]),
                    "orbital_period_days":
                        safe_float(planet["pl_orbper"]),
                    "category":
                        classify_planet(
                            planet["pl_rade"],
                            planet["pl_bmasse"],
                            planet["pl_eqt"]
                        ),
                    "moons": None
                })


def safe_float(value):

    try:
        return float(value)
    except:
        return None


def main():

    print("Downloading nearby stars...")
    stars = get_nearest_stars()

    print("Downloading exoplanets...")
    planets = get_exoplanets()

    print("Matching planets...")
    attach_planets(stars, planets)

    print("Writing JSON...")

    with open(
        OUTPUT,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            stars,
            f,
            indent=2,
            ensure_ascii=False
        )

    print(
        f"Created {OUTPUT}"
    )


if __name__ == "__main__":
    main()