from sqlalchemy import String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from database.database import Base


class User(Base):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(64), primary_key=True)
    password: Mapped[str] = mapped_column(String(256))
    claimed_planet: Mapped[str | None] = mapped_column(String(256), nullable=True, default=None)


class Sector(Base):
    __tablename__ = "sectors"

    name: Mapped[str] = mapped_column(String(128), primary_key=True)
    systems: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list)
    distances_map: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    nco: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    fleets_in_transit: Mapped[dict] = mapped_column(JSONB, nullable=False, default=list)
