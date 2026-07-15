from dataclasses import dataclass


@dataclass(frozen=True)
class ShipDef:
    type: str
    display_name: str
    description: str
    power: int
    build_time_seconds: int
    requires_building: str  # building type that must exist on the planet


SHIPS: dict[str, ShipDef] = {
    "scout": ShipDef(
        type="scout",
        display_name="Scout",
        description="Fast recon vessel. Low combat power but reveals enemy fleet positions.",
        power=10,
        build_time_seconds=60,
        requires_building="settlement",
    ),
    "fighter": ShipDef(
        type="fighter",
        display_name="Fighter",
        description="Balanced attack craft. The backbone of most fleets.",
        power=30,
        build_time_seconds=180,
        requires_building="factory",
    ),
    "destroyer": ShipDef(
        type="destroyer",
        display_name="Destroyer",
        description="Heavy warship effective against fighters and installations.",
        power=60,
        build_time_seconds=600,
        requires_building="shipyard",
    ),
    "cruiser": ShipDef(
        type="cruiser",
        display_name="Cruiser",
        description="Capital ship with massive firepower and durable hull.",
        power=150,
        build_time_seconds=1800,
        requires_building="shipyard",
    ),
}

MAX_FLEETS = 10


def get_ship(ship_type: str) -> ShipDef | None:
    return SHIPS.get(ship_type)
