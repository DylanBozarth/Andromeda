from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from database.database import Base


class User(Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(64), primary_key=True)
    password: Mapped[str] = mapped_column(String(256))
    # list of "sector/system/planet" strings, max 10
    claimed_slots: Mapped[list] = mapped_column(JSONB, nullable=False, server_default='[]')


class Sector(Base):
    __tablename__ = "sectors"

    name: Mapped[str] = mapped_column(String(128), primary_key=True)
    systems: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list)
    distances_map: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    nco: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    fleets_in_transit: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list)


class Building(Base):
    __tablename__ = "buildings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    planet_key: Mapped[str] = mapped_column(String(256), nullable=False, index=True)
    owner: Mapped[str] = mapped_column(String(64), nullable=False)
    building_type: Mapped[str] = mapped_column(String(64), nullable=False)
    level: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    # 'constructing' until duration_seconds elapses, then 'complete'
    status: Mapped[str] = mapped_column(String(16), nullable=False, default='complete')
    started_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=60)


class Ship(Base):
    __tablename__ = "ships"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    owner: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    ship_type: Mapped[str] = mapped_column(String(64), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    power: Mapped[int] = mapped_column(Integer, nullable=False)
    max_power: Mapped[int] = mapped_column(Integer, nullable=False)
    # where the ship was built / currently docked ("sector/system/planet" or fleet id)
    location: Mapped[str] = mapped_column(String(256), nullable=False)
    # null = docked at planet, otherwise the fleet id it belongs to
    fleet_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("fleets.id", ondelete="SET NULL"), nullable=True)
    # 'constructing' while being built, 'complete' when ready
    status: Mapped[str] = mapped_column(String(16), nullable=False, server_default='complete')
    started_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, nullable=False, server_default='60')


class Fleet(Base):
    __tablename__ = "fleets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    owner: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    # idle | in-transit | in-battle | retreating
    status: Mapped[str] = mapped_column(String(16), nullable=False, default='idle')
    location: Mapped[str | None] = mapped_column(String(256), nullable=True)
    destination: Mapped[str | None] = mapped_column(String(256), nullable=True)
