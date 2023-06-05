import { getSortedObjectByProperty } from '../arrays';
import { Planet } from '../../types/planet-interface';
import { generateRandomNumber } from '../math';
import { buildingTypes } from './buildings';
import { planetList } from './planets';
import { resources } from './resources';
import { starList } from './stars';
import { NCOList } from './NCOS';
import {
  getRandomSystemStar,
  getRandomPlanet,
  getRandomResource,
  getSystemCoords,
  parseOutXandYfromCords,
  calculateDistance,
  getRandomBuildings,
  getRandomNCO
} from './system-functions';
import { NCONameGenerator, systemNameGenerator } from './system-name-generator';
import { Sector } from '../../redux/sectorSlice';

export interface System {
  systemStar: string;
  systemPlanets: Array<Planet>;
  systemName: string;
  cords: string;
  activePlanet: Planet
}

export interface NCO { // NCO = Non-conolizable-object
  type: string;
  name: string;
  effect: string;
  cords: string;
  fleets: Array<string>;
}

const generateSystem = (maxPlanets: number) => {
  const system: System = {
    systemStar: getRandomSystemStar(starList),
    systemName: systemNameGenerator(1)[0],
    systemPlanets: [],
    cords: '',
    activePlanet: {
      name: '',
      naturalResources: [],
      buildings: [],
      resourceStorage: [],
      production: [],
      hangar: [],
      ownership: ''
    }
  };

  console.log({ system });
  system.cords = getSystemCoords('R');

  const randomPlanetNumber = generateRandomNumber(maxPlanets);

  for (let i = 0; i < randomPlanetNumber; i++) {
    const planetName = getRandomPlanet(planetList);
    const resource1 = getRandomResource(resources);
    const resource2 = getRandomResource(resources, resource1);
    const planet: Planet = {
      name: planetName,
      naturalResources: [resource1, resource2],
      buildings: [],
      resourceStorage: [],
      production: [],
      hangar: [],
      ownership: 'unowned'
    };
    system.systemPlanets.push(planet);
  }

  return system;
};

const generateNCOs = () => {
  const NCO: NCO = {
    type: getRandomNCO(NCOList),
    name: NCONameGenerator('a'), // change here for sector letter
    effect: '10 damage',
    cords: '',
    fleets: []
  };
  NCO.cords = getSystemCoords('A')
  return NCO
}

export type DistanceMap = Record<string, Record<string, { distance: number; eta: string }>>;

const timeScale = 15; // 15 minutes for each parsec

export const generateSector = (maxSystems: number, maxPlanets: number): Sector => {
  const randomSystemNumber = generateRandomNumber(maxSystems);
  const systems: System[] = [];
  const NCO: NCO[] = [];
  // control min number of systems and NCOs here
  for (let i = -60; i < randomSystemNumber; i++) {
    const system = generateSystem(maxPlanets);
    systems.push(system);
  }
  for (let i = -45; i < randomSystemNumber; i++) {
    const NCOArray = generateNCOs()
    NCO.push(NCOArray);
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
  return {
    systems,
    distancesMap,
    NCO,
    sectorName: 'sector-a', // Change this for other sectors
    fleetsInTransit: []
  };
};
