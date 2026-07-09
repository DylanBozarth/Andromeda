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
    return {"username": payload["sub"], "claimedPlanet": user.claimed_planet if user else None}


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
    if user.claimed_planet:
        raise HTTPException(status_code=409, detail="You have already claimed a planet")

    sector = await db.get(Sector, body.sector_name)
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")

    # Find the planet in the JSONB systems list and verify it's unowned
    systems = list(sector.systems)
    planet_found = False
    for system in systems:
        if system.get("systemName") == body.system_name:
            for planet in system.get("systemPlanets", []):
                if planet.get("name") == body.planet_name:
                    if planet.get("ownership") != "unowned":
                        raise HTTPException(status_code=409, detail="Planet is already owned")
                    planet["ownership"] = user.username
                    planet_found = True
                    break

    if not planet_found:
        raise HTTPException(status_code=404, detail="Planet not found")

    # SQLAlchemy won't detect in-place JSONB mutations — reassign to flag dirty
    from sqlalchemy.orm.attributes import flag_modified
    flag_modified(sector, "systems")

    claim_key = f"{body.sector_name}/{body.system_name}/{body.planet_name}"
    user.claimed_planet = claim_key
    await db.commit()

    return {"claimed": claim_key}


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
