from sqlalchemy import Integer, String
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
    # "sector/system/planet"
    planet_key: Mapped[str] = mapped_column(String(256), nullable=False, index=True)
    owner: Mapped[str] = mapped_column(String(64), nullable=False)
    building_type: Mapped[str] = mapped_column(String(64), nullable=False)
    level: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
