import { generateRandomNumber } from '../math';
import { planetList } from './planets';
import { resources } from './resources';
import { starList } from './stars';
import {
  getRandomSystemStar,
  getRandomNumberString,
  getRandomPlanet,
  getRandomResource,
  getSystemCoords,
} from './system-functions';

export interface System {
  systemStar: string;
  systemPlanets: Record<string, string[]>;
  systemName: string;
  cords: string;
  ownership: string;
  hangar: [];
}

const generateSystem = (maxPlanets: number) => {
  const system: System = {
    systemStar: getRandomSystemStar(starList),
    systemPlanets: {},
    systemName: getRandomNumberString(),
    cords: '',
    ownership: 'unowned',
    hangar: [],
  };

  system.cords = getSystemCoords(system.systemName[0]);

  const randomPlanetNumber = generateRandomNumber(maxPlanets);

  for (let i = 0; i < randomPlanetNumber; i++) {
    const planetName = getRandomPlanet(planetList);
    const resource1 = getRandomResource(resources);
    const resource2 = getRandomResource(resources, resource1);
    system.systemPlanets[planetName] = [resource1, resource2];
  }

  return system;
};

export const generateMultipleSystems = (maxSystems: number, maxPlanets: number) => {
  const randomSystemNumber = generateRandomNumber(maxSystems);
  const systems: System[] = [];

  for (let i = 0; i < randomSystemNumber; i++) {
    const system = generateSystem(maxPlanets);
    systems.push(system);
  }

  console.log(systems);
  return systems;
};
generateMultipleSystems(10, 8);
