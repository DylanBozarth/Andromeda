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
import { systemNameGenerator } from './system-name-generator';

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
    systemName: systemNameGenerator(1)[0],
    cords: '',
    ownership: 'unowned',
    hangar: [],
  };

  console.log({ system });
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
    distancesMap[system.systemName] = {};
    systems
      .filter((val) => val.systemName !== system.systemName)
      .forEach((item) => {
        const { x: x2, y: y2 } = parseOutXandYfromCords(item.cords);
        const distance = calculateDistance(x1, y1, x2, y2);
        distancesMap[system.systemName] = {
          ...distancesMap[system.systemName],
          [item.systemName]: {
            distance,
            eta: `${(distance * timeScale) / 60}`,
          },
        };
      });
    distancesMap[system.systemName] = getSortedObjectByProperty(
      distancesMap[system.systemName],
      'distance',
    );
  }

  console.log({ distancesMap });
  return {
    systems,
    distancesMap,
  };
};
