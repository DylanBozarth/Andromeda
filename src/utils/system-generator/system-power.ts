import { Planet } from '../../types/planet-interface';
import { System } from './generate-sector';
import { Ship } from './ship';

export const baseShipPowerValue = 1;
export const baseBuildingPowerValue = 1;

export const getSystemPower = (playerSystem: System) => {
  let buildingPower = 0;
  playerSystem.systemPlanets.forEach((planet) => {
    buildingPower += getBuildingPowerCounts(planet);
  });
  return {
    shipPower: getShipPowerCounts(playerSystem.hangar),
    buildingPower,
  };
};

const getBuildingPowerCounts = (planet: Planet) => {
  let buildingPower = 0;
  planet.buildings.forEach((_building) => {
    console.log({ _building });
    buildingPower += baseBuildingPowerValue;
  });
  return buildingPower;
};

const getShipPowerCounts = (hangar: Ship[]) => {
  const shipPower = 0;
  hangar.forEach((_ship) => {
    console.log({ _ship });
  });
  return shipPower;
};
