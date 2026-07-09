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
    buildingPower,
  };
};

const getBuildingPowerCounts = (planet: Planet) => baseBuildingPowerValue * planet.buildings.length;

const getShipPowerCounts = (hanger: string[]) => baseShipPowerValue * hanger.length;
