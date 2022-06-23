import { getSortedObjectByProperty } from '../arrays';
import { generateRandomNumber } from '../math';
import { planetList } from './planets';
import { resources } from './resources';
import { starList } from './stars';
import {
  getRandomSystemStar,
  getRandomPlanet,
  getRandomResource,
  getSystemCoords,
  parseOutXandYfromCords,
  calculateDistance,
} from './system-functions';

export interface System {
  systemStar: string;
  systemPlanets: Record<string, string[]>;
  cords: string;
  ownership: string;
  hangar: [];
}

const generateSystem = (maxPlanets: number) => {
  const system: System = {
    systemStar: getRandomSystemStar(starList),
    systemPlanets: {},
    cords: '',
    ownership: 'unowned',
    hangar: [],
  };

  system.cords = getSystemCoords('R');

  const randomPlanetNumber = generateRandomNumber(maxPlanets);

  for (let i = 0; i < randomPlanetNumber; i++) {
    const planetName = getRandomPlanet(planetList);
    const resource1 = getRandomResource(resources);
    const resource2 = getRandomResource(resources, resource1);
    system.systemPlanets[planetName] = [resource1, resource2];
  }

  return system;
};

export type DistanceMap = Record<string, Record<string, { distance: number; eta: string }>>;

const timeScale = 15; // 15 minutes for each parsec

export const generateMultipleSystems = (maxSystems: number, maxPlanets: number) => {
  const randomSystemNumber = generateRandomNumber(maxSystems);
  const systems: System[] = [];

  for (let i = 0; i < randomSystemNumber; i++) {
    const system = generateSystem(maxPlanets);
    systems.push(system);
  }

  const distancesMap = {} as DistanceMap;
  for (const system of systems) {
    const { x: x1, y: y1 } = parseOutXandYfromCords(system.cords);
    distancesMap[system.cords] = {};
    systems
      .filter((val) => val.cords !== system.cords)
      .forEach((item) => {
        const { x: x2, y: y2 } = parseOutXandYfromCords(item.cords);
        const distance = calculateDistance(x1, y1, x2, y2);
        distancesMap[system.cords] = {
          ...distancesMap[system.cords],
          [item.cords]: {
            distance,
            eta: `${(distance * timeScale) / 60}`,
          },
        };
      });
    distancesMap[system.cords] = getSortedObjectByProperty(distancesMap[system.cords], 'distance');
  }

  return {
    systems,
    distancesMap,
  };
};
generateMultipleSystems(10, 8);
