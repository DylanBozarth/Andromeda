from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.auth import verify_token
from backend.buildings.definitions import BUILDINGS, get_building
from database.database import get_db
from database.models import Building, User  # User kept for auth lookup

router = APIRouter(prefix="/buildings")


class BuildRequest(BaseModel):
    sector_name: str
    system_name: str
    planet_name: str
    building_type: str


@router.get("/types")
async def list_building_types():
    return {
        "buildings": [
            {
                "type": b.type,
                "displayName": b.display_name,
                "description": b.description,
                "maxLevel": b.max_level,
            }
            for b in BUILDINGS.values()
        ]
    }


@router.post("/build")
async def construct_building(
    body: BuildRequest,
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_token),
):
    username = payload["sub"]

    definition = get_building(body.building_type)
    if not definition:
        raise HTTPException(status_code=400, detail=f"Unknown building type: {body.building_type}")

    user = await db.get(User, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    planet_key = f"{body.sector_name}/{body.system_name}/{body.planet_name}"

    result = await db.execute(
        select(Building).where(
            Building.planet_key == planet_key,
            Building.building_type == body.building_type,
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        if existing.level >= definition.max_level:
            raise HTTPException(
                status_code=409,
                detail=f"{definition.display_name} is already at max level ({definition.max_level})",
            )
        existing.level += 1
        await db.commit()
        return {"planet": planet_key, "buildingType": body.building_type, "level": existing.level}

    building = Building(
        planet_key=planet_key,
        owner=username,
        building_type=body.building_type,
        level=1,
    )
    db.add(building)
    await db.commit()
    return {"planet": planet_key, "buildingType": body.building_type, "level": 1}


@router.get("/planet/{sector_name}/{system_name}/{planet_name}")
async def get_planet_buildings(
    sector_name: str,
    system_name: str,
    planet_name: str,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_token),
):
    planet_key = f"{sector_name}/{system_name}/{planet_name}"
    result = await db.execute(select(Building).where(Building.planet_key == planet_key))
    buildings = result.scalars().all()
    return {
        "planet": planet_key,
        "buildings": [
            {"buildingType": b.building_type, "level": b.level, "owner": b.owner}
            for b in buildings
        ],
    }
