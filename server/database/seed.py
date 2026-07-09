"""Run once to create tables and load example-sector.json into the database."""
import asyncio
import json
from pathlib import Path

from database.database import Base, engine, SessionLocal
from database.models import Sector, User

SECTOR_FILE = Path(__file__).parent.parent.parent / "example-sector.json"


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        existing = await db.get(User, "admin")
        if not existing:
            db.add(User(username="admin", password="password"))

        data = json.loads(SECTOR_FILE.read_text())
        name = data.get("sectorName", "sector-a")
        existing_sector = await db.get(Sector, name)
        if not existing_sector:
            db.add(Sector(
                name=name,
                systems=data.get("systems", []),
                distances_map=data.get("distancesMap", {}),
                nco=data.get("NCO", {}),
                fleets_in_transit=data.get("fleetsInTransit", []),
            ))

        await db.commit()
        print(f"Seeded user 'admin' and sector '{name}'.")


if __name__ == "__main__":
    asyncio.run(seed())
