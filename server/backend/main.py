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
from backend.player_actions import router as player_actions_router
from backend.buildings.routes import router as buildings_router
from backend.fleets.routes import router as fleets_router
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

app.include_router(player_actions_router)
app.include_router(buildings_router)
app.include_router(fleets_router)


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


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
