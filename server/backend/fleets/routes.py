import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.auth import verify_token
from backend.fleets.definitions import get_ship, MAX_FLEETS
from database.database import get_db
from database.models import Building, Fleet, Ship, User

router = APIRouter(prefix="/fleets")

SHIP_BUILD_SECONDS = 60


def _now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


async def _tick_ships(ships: list[Ship], db: AsyncSession) -> None:
    dirty = False
    for s in ships:
        if s.status == 'constructing' and s.started_at:
            if (_now() - s.started_at).total_seconds() >= s.duration_seconds:
                s.status = 'complete'
                dirty = True
    if dirty:
        await db.commit()


def _serialize_ship(s: Ship) -> dict:
    return {
        "id": str(s.id),
        "type": s.ship_type,
        "name": s.name,
        "power": s.power,
        "maxPower": s.max_power,
        "builtAt": s.location,
        "owner": s.owner,
        "status": s.status,
        "startedAt": s.started_at.isoformat() if s.started_at else None,
        "durationSeconds": s.duration_seconds,
    }


def _serialize_fleet(f: Fleet, ships: list[Ship]) -> dict:
    ready = [s for s in ships if s.status == 'complete']
    total = sum(s.max_power for s in ready)
    current = sum(s.power for s in ready)
    return {
        "id": str(f.id),
        "name": f.name,
        "owner": f.owner,
        "status": f.status,
        "location": f.location,
        "destination": f.destination,
        "power": current,
        "maxPower": total,
        "ships": [_serialize_ship(s) for s in ready],
    }


@router.get("")
async def list_fleets(
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_token),
):
    username = payload["sub"]
    result = await db.execute(select(Fleet).where(Fleet.owner == username))
    fleets = result.scalars().all()

    out = []
    for fleet in fleets:
        ship_result = await db.execute(select(Ship).where(Ship.fleet_id == fleet.id))
        ships = ship_result.scalars().all()
        out.append(_serialize_fleet(fleet, ships))

    return {"fleets": out}


@router.get("/hangar/{sector_name}/{system_name}/{planet_name}")
async def get_hangar(
    sector_name: str,
    system_name: str,
    planet_name: str,
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_token),
):
    username = payload["sub"]
    planet_key = f"{sector_name}/{system_name}/{planet_name}"
    result = await db.execute(
        select(Ship).where(Ship.owner == username, Ship.location == planet_key, Ship.fleet_id == None)
    )
    ships = result.scalars().all()
    await _tick_ships(list(ships), db)
    ready = [s for s in ships if s.status == 'complete']
    return {"ships": [_serialize_ship(s) for s in ready]}


@router.get("/production/{sector_name}/{system_name}/{planet_name}")
async def get_ship_production(
    sector_name: str,
    system_name: str,
    planet_name: str,
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_token),
):
    username = payload["sub"]
    planet_key = f"{sector_name}/{system_name}/{planet_name}"
    result = await db.execute(
        select(Ship).where(
            Ship.owner == username,
            Ship.location == planet_key,
            Ship.fleet_id == None,
            Ship.status == 'constructing',
        )
    )
    ships = result.scalars().all()
    await _tick_ships(list(ships), db)
    # return only still-constructing after tick
    still_building = [s for s in ships if s.status == 'constructing']
    return {"ships": [_serialize_ship(s) for s in still_building]}


@router.post("/build-ship")
async def build_ship(
    body: "BuildShipRequest",
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_token),
):
    username = payload["sub"]
    definition = get_ship(body.ship_type)
    if not definition:
        raise HTTPException(status_code=400, detail=f"Unknown ship type: {body.ship_type}")

    planet_key = f"{body.sector_name}/{body.system_name}/{body.planet_name}"

    user = await db.get(User, username)
    if not user or planet_key not in (user.claimed_slots or []):
        raise HTTPException(status_code=403, detail="You must have a colony on this planet to build ships here")

    building_result = await db.execute(
        select(Building).where(
            Building.planet_key == planet_key,
            Building.building_type == definition.requires_building,
            Building.status == "complete",
        )
    )
    if not building_result.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail=f"Requires a completed {definition.requires_building.replace('_', ' ')} on this planet",
        )

    ship = Ship(
        owner=username,
        ship_type=definition.type,
        name=f"{definition.display_name}-{uuid.uuid4().hex[:6].upper()}",
        power=definition.power,
        max_power=definition.power,
        location=planet_key,
        fleet_id=None,
        status='constructing',
        started_at=_now(),
        duration_seconds=SHIP_BUILD_SECONDS,
    )
    db.add(ship)
    await db.commit()
    await db.refresh(ship)
    return _serialize_ship(ship)


@router.post("/create")
async def create_fleet(
    body: "CreateFleetRequest",
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_token),
):
    username = payload["sub"]

    fleet_count_result = await db.execute(select(Fleet).where(Fleet.owner == username))
    existing_fleets = fleet_count_result.scalars().all()
    if len(existing_fleets) >= MAX_FLEETS:
        raise HTTPException(status_code=400, detail=f"Fleet limit reached ({MAX_FLEETS})")

    fleet = Fleet(owner=username, name=body.name, status="idle")
    db.add(fleet)
    await db.flush()

    ships: list[Ship] = []
    for ship_id in body.ship_ids:
        ship = await db.get(Ship, int(ship_id))
        if not ship or ship.owner != username:
            raise HTTPException(status_code=404, detail=f"Ship {ship_id} not found")
        if ship.fleet_id is not None:
            raise HTTPException(status_code=400, detail=f"Ship {ship_id} is already in a fleet")
        if ship.status != 'complete':
            raise HTTPException(status_code=400, detail=f"Ship {ship_id} is still under construction")
        ship.fleet_id = fleet.id
        ships.append(ship)

    await db.commit()
    return _serialize_fleet(fleet, ships)


@router.post("/assign-ship")
async def assign_ship(
    body: "AssignShipRequest",
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_token),
):
    username = payload["sub"]

    ship = await db.get(Ship, int(body.ship_id))
    if not ship or ship.owner != username:
        raise HTTPException(status_code=404, detail="Ship not found")
    if ship.fleet_id is not None:
        raise HTTPException(status_code=400, detail="Ship is already in a fleet")
    if ship.status != 'complete':
        raise HTTPException(status_code=400, detail="Ship is still under construction")

    fleet = await db.get(Fleet, int(body.fleet_id))
    if not fleet or fleet.owner != username:
        raise HTTPException(status_code=404, detail="Fleet not found")
    if fleet.status != "idle":
        raise HTTPException(status_code=400, detail="Can only assign ships to idle fleets")

    ship.fleet_id = fleet.id
    await db.commit()
    return {"assigned": True}


@router.delete("/{fleet_id}")
async def disband_fleet(
    fleet_id: int,
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_token),
):
    username = payload["sub"]
    fleet = await db.get(Fleet, fleet_id)
    if not fleet or fleet.owner != username:
        raise HTTPException(status_code=404, detail="Fleet not found")
    if fleet.status != "idle":
        raise HTTPException(status_code=400, detail="Can only disband idle fleets")

    ship_result = await db.execute(select(Ship).where(Ship.fleet_id == fleet.id))
    for ship in ship_result.scalars().all():
        ship.fleet_id = None

    await db.delete(fleet)
    await db.commit()
    return {"disbanded": fleet_id}


class BuildShipRequest(BaseModel):
    sector_name: str
    system_name: str
    planet_name: str
    ship_type: str


class CreateFleetRequest(BaseModel):
    name: str
    ship_ids: list[str]


class AssignShipRequest(BaseModel):
    ship_id: str
    fleet_id: str
