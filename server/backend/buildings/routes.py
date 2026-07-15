from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.auth import verify_token
from backend.buildings.definitions import BUILDINGS, get_building
from database.database import get_db
from database.models import Building, User

router = APIRouter(prefix="/buildings")

BUILD_DURATION_SECONDS = 60


def _serialize(b: Building, queue_position: int | None = None) -> dict:
    return {
        "buildingType": b.building_type,
        "level": b.level,
        "owner": b.owner,
        "status": b.status,
        "startedAt": b.started_at.isoformat() if b.started_at else None,
        "durationSeconds": b.duration_seconds,
        "queuePosition": queue_position,
    }


def _now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


async def _tick(buildings: list[Building], db: AsyncSession) -> None:
    """Complete elapsed buildings, then start the next queued one."""
    now = _now()
    dirty = False

    for b in buildings:
        if b.status == 'constructing' and b.started_at:
            if (now - b.started_at).total_seconds() >= b.duration_seconds:
                b.status = 'complete'
                dirty = True

    constructing = [b for b in buildings if b.status == 'constructing']
    if not constructing:
        queued = sorted([b for b in buildings if b.status == 'queued'], key=lambda b: b.id)
        if queued:
            queued[0].status = 'constructing'
            queued[0].started_at = now
            dirty = True

    if dirty:
        await db.commit()


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
    body: "BuildRequest",
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

    # check if this building type is already active
    existing_result = await db.execute(
        select(Building).where(
            Building.planet_key == planet_key,
            Building.building_type == body.building_type,
        )
    )
    existing = existing_result.scalar_one_or_none()

    if existing:
        if existing.status in ('constructing', 'queued'):
            raise HTTPException(status_code=409, detail="Already building or queued")
        if existing.level >= definition.max_level:
            raise HTTPException(status_code=409, detail=f"{definition.display_name} is at max level")
        existing.level += 1
        target = existing
    else:
        target = Building(
            planet_key=planet_key,
            owner=username,
            building_type=body.building_type,
            level=1,
            duration_seconds=BUILD_DURATION_SECONDS,
        )
        db.add(target)
        await db.flush()  # get id assigned

    # check if anything is currently constructing or queued
    active_result = await db.execute(
        select(Building).where(
            Building.planet_key == planet_key,
            Building.status.in_(['constructing', 'queued']),
            Building.id != target.id,
        )
    )
    active = active_result.scalars().all()
    anything_active = any(b.status == 'constructing' for b in active) or bool(active)

    if anything_active:
        target.status = 'queued'
        target.started_at = None
    else:
        target.status = 'constructing'
        target.started_at = _now()

    await db.commit()

    queue_pos = None
    if target.status == 'queued':
        queued = sorted([b for b in active if b.status == 'queued'], key=lambda b: b.id)
        queue_pos = len(queued) + 1

    return _serialize(target, queue_pos)


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

    await _tick(buildings, db)

    queued_sorted = sorted([b for b in buildings if b.status == 'queued'], key=lambda b: b.id)
    queue_pos_map = {b.id: i + 1 for i, b in enumerate(queued_sorted)}

    return {
        "planet": planet_key,
        "buildings": [_serialize(b, queue_pos_map.get(b.id)) for b in buildings],
    }


class BuildRequest(BaseModel):
    sector_name: str
    system_name: str
    planet_name: str
    building_type: str
