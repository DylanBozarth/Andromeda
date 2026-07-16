import { getSortedObjectByProperty } from '../arrays';
import { Planet } from '../../types/planet-interface';
import { generateRandomNumber } from '../math';

const slotCountForClass = (planetClass: string): number => {
  const base = planetClass.replace(/\d+$/, '');
  if (['Temperate', 'Ocean', 'Greenhouse'].includes(base)) return generateRandomNumber(8, 5);
  if (['Desert', 'Rocky', 'Frozen'].includes(base))        return generateRandomNumber(5, 3);
  if (['Lava', 'Gas'].includes(base))                      return generateRandomNumber(3, 2);
  return 2; // Asteroid-Belt
};

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
import { Sector } from '../../context/GameContext';

export type SystemPositions = Record<string, null>;

const generatePositions = (systemName: string, planets: string[]): SystemPositions => {
  const positions: SystemPositions = {};

  for (const planet of planets) {
    for (let i = 1; i <= 8; i++) {
      positions[`${planet}-orbit-${i}`] = null;
    }
  }

  for (let i = 1; i <= 20; i++) {
    positions[`${systemName}-above-${i}`] = null;
  }
  for (let i = 1; i <= 20; i++) {
    positions[`${systemName}-below-${i}`] = null;
  }

  for (let i = 1; i <= 50; i++) {
    positions[`${systemName}-outer-${i}`] = null;
  }

  return positions;
};

export interface System {
  systemStar: string;
  systemPlanets: Array<Planet>;
  systemName: string;
  cords: string;
  activePlanet: Planet;
  positions: SystemPositions;
}

export type NCOPositions = Record<string, null>;

const generateNCOPositions = (ncoName: string): NCOPositions => {
  const positions: NCOPositions = {};
  for (let i = 1; i <= 50; i++) {
    positions[`${ncoName}-outer-${i}`] = null;
  }
  for (let i = 1; i <= 20; i++) {
    positions[`${ncoName}-inner-${i}`] = null;
  }
  return positions;
};

export interface NCO { // NCO = Non-conolizable-object
  type: string;
  name: string;
  effect: string;
  cords: string;
  fleets: Array<string>;
  positions: NCOPositions;
}

const generateSystem = (maxPlanets: number) => {
  const system: System = {
    systemStar: getRandomSystemStar(starList),
    systemName: systemNameGenerator(1)[0],
    systemPlanets: [],
    cords: '',
    positions: {},
    activePlanet: {
      name: '',
      class: '',
      naturalResources: [],
      buildings: [],
      resourceStorage: [],
      production: [],
      hangar: [],
      orbit: [],
      populationSlots: []
    }
  };

  console.log({ system });
  system.cords = getSystemCoords('R');

  const randomPlanetNumber = generateRandomNumber(maxPlanets);

  for (let i = 0; i < randomPlanetNumber; i++) {
    const planetName = getRandomPlanet(planetList);
    const resource1 = getRandomResource(resources);
    const resource2 = getRandomResource(resources, resource1);
    const slotCount = slotCountForClass(planetName);
    const planet: Planet = {
      name: system.systemName + '-' + (i + 1),
      class: planetName,
      naturalResources: [resource1, resource2],
      buildings: [],
      resourceStorage: [],
      production: [],
      orbit: [],
      hangar: [],
      populationSlots: Array.from({ length: slotCount }, (_, idx) => ({ slotId: idx, occupant: null })),
    };
    system.systemPlanets.push(planet);
  }

  system.positions = generatePositions(
    system.systemName,
    system.systemPlanets.map(p => p.name),
  );

  return system;
};

const generateNCOs = () => {
  const NCO: NCO = {
    type: getRandomNCO(NCOList),
    name: NCONameGenerator('a'), // change here for sector letter
    effect: '10 damage',
    cords: '',
    fleets: [],
    positions: {}
  };
  NCO.cords = getSystemCoords('A');
  NCO.positions = generateNCOPositions(NCO.name);
  return NCO
}

export type DistanceMap = Record<string, Record<string, { distance: number; eta: string }>>;

const timeScale = 15; // 15 minutes for each parsec

export const generateSector = (maxSystems: number, maxPlanets: number): Sector => {
  const randomSystemNumber = generateRandomNumber(maxSystems);
  const systems: System[] = [];
  const NCO: NCO[] = [];
  // control min number of systems and NCOs here
  for (let i = -110; i < randomSystemNumber; i++) {
    const system = generateSystem(maxPlanets);
    systems.push(system);
  }
  for (let i = -65; i < randomSystemNumber; i++) {
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
  console.log({systems,
    distancesMap,
    NCO,
    sectorName: 'sector-a', // Change this for other sectors
    fleetsInTransit: []}) // for logging it all to the console.
  return {
    systems,
    distancesMap,
    NCO,
    sectorName: 'sector-a', // Change this for other sectors
    fleetsInTransit: []
  };
};
