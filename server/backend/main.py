import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / ".env")

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.auth import create_access_token, verify_token
from database.database import get_db
from database.models import Sector, User

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class ClaimRequest(BaseModel):
    sector_name: str
    system_name: str
    planet_name: str


@app.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await db.get(User, body.username)
    if not user or user.password != body.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/me")
async def me(db: AsyncSession = Depends(get_db), payload: dict = Depends(verify_token)):
    user = await db.get(User, payload["sub"])
    claimed_slots = list(user.claimed_slots) if user and user.claimed_slots else []
    return {"username": payload["sub"], "claimedSlots": claimed_slots}


@app.get("/sectors")
async def list_sectors(db: AsyncSession = Depends(get_db), _: dict = Depends(verify_token)):
    result = await db.execute(select(Sector.name))
    return {"sectors": result.scalars().all()}


@app.post("/claim-planet")
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

    from sqlalchemy.orm.attributes import flag_modified
    flag_modified(sector, "systems")

    user.claimed_slots = claimed_slots + [claim_key]
    from sqlalchemy.orm.attributes import flag_modified as flag_user
    flag_user(user, "claimed_slots")
    await db.commit()

    return {"claimed": claim_key, "claimedSlots": user.claimed_slots}


@app.get("/sectors/{name}")
async def get_sector(name: str, db: AsyncSession = Depends(get_db), _: dict = Depends(verify_token)):
    sector = await db.get(Sector, name)
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    return {
        "sectorName": sector.name,
        "systems": sector.systems,
        "distancesMap": sector.distances_map,
        "NCO": sector.nco,
        "fleetsInTransit": sector.fleets_in_transit,
    }
