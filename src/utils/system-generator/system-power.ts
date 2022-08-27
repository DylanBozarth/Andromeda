import { Planet } from '../../types/planet-interface';
import { System } from './generate-sector';

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

const getShipPowerCounts = (hanger: string[]) => {
  let shipPower = 0;
  hanger.forEach((_ship) => {
    console.log({ _ship });
    shipPower += baseShipPowerValue;
  });
  return shipPower;
};
