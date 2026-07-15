from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import flag_modified

from backend.auth import verify_token
from database.database import get_db
from database.models import Sector, User

router = APIRouter()


class ClaimRequest(BaseModel):
    sector_name: str
    system_name: str
    planet_name: str


@router.post("/claim-planet")
async def claim_planet(
    body: ClaimRequest,
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(verify_token),
):
    user = await db.get(User, payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    claimed_slots = list(user.claimed_slots) if user.claimed_slots else []
    claim_key = f"{body.sector_name}/{body.system_name}/{body.planet_name}"

    if len(claimed_slots) >= 10:
        raise HTTPException(status_code=409, detail="You have reached the 10 colony limit")
    if claim_key in claimed_slots:
        raise HTTPException(status_code=409, detail="You already have a colony on this planet")

    sector = await db.get(Sector, body.sector_name)
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")

    systems = list(sector.systems)
    planet_found = False
    for system in systems:
        if system.get("systemName") == body.system_name:
            for planet in system.get("systemPlanets", []):
                if planet.get("name") == body.planet_name:
                    slots = planet.get("populationSlots", [])
                    empty = next((s for s in slots if s.get("occupant") is None), None)
                    if empty is None:
                        raise HTTPException(status_code=409, detail="No empty population slots on this planet")
                    empty["occupant"] = user.username
                    planet_found = True
                    break

    if not planet_found:
        raise HTTPException(status_code=404, detail="Planet not found")

    flag_modified(sector, "systems")
    user.claimed_slots = claimed_slots + [claim_key]
    flag_modified(user, "claimed_slots")
    await db.commit()

    return {"claimed": claim_key, "claimedSlots": user.claimed_slots}
