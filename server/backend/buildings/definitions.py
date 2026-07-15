"""Static building definitions — type, cost, and effects."""

from dataclasses import dataclass


@dataclass(frozen=True)
class BuildingDef:
    type: str
    display_name: str
    description: str
    max_level: int


BUILDINGS: dict[str, BuildingDef] = {
    "settlement": BuildingDef(
        type="settlement",
        display_name="Settlement",
        description="A basic colony structure. Houses workers and provides administrative capacity.",
        max_level=5,
    ),
    "mine": BuildingDef(
        type="mine",
        display_name="Mine",
        description="Extracts raw minerals from the planet surface.",
        max_level=5,
    ),
    "factory": BuildingDef(
        type="factory",
        display_name="Factory",
        description="Processes raw minerals into usable materials.",
        max_level=5,
    ),
    "shipyard": BuildingDef(
        type="shipyard",
        display_name="Shipyard",
        description="Constructs and repairs ships.",
        max_level=3,
    ),
    "defense_turret": BuildingDef(
        type="defense_turret",
        display_name="Defense Turret",
        description="Provides orbital defense against incoming fleets.",
        max_level=5,
    ),
}


def get_building(type: str) -> BuildingDef | None:
    return BUILDINGS.get(type)
