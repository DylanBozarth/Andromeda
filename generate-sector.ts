let starList: string[] = [
  "Red-Giant",
  "Red-Supergiant",
  "Blue-Giant",
  "White-Dwarf",
  "Yellow-Dwarf",
  "Red-Dwarf",
  "Brown-Dwarf",
];

let planetList: string[] = [
  "Rocky1",
  "Rocky2",
  "Rocky3",
  "Rocky4",
  "Rocky5",
  "Temperate1",
  "Temperate2",
  "Temperate3",
  "Temperate4",
  "Temperate5",
  "Ocean1",
  "Ocean2",
  "Ocean3",
  "Ocean4",
  "Ocean5",
  "Frozen1",
  "Frozen2",
  "Frozen3",
  "Frozen4",
  "Frozen5",
  "Lava1",
  "Lava2",
  "Lava3",
  "Lava4",
  "Lava5",
  "Gas1",
  "Gas2",
  "Gas3",
  "Gas4",
  "Gas5",
  "Desert1",
  "Desert2",
  "Desert3",
  "Desert4",
  "Desert5",
  "Greenhouse1",
  "Greenhouse2",
  "Greenhouse3",
  "Greenhouse4",
  "Greenhouse5",
  "Asteroid-Belt1",
  "Asteroid-Belt2",
  "Asteroid-Belt3",
];

let resources: string[] = [
  "ore-low",
  "ore-high",
  "ore-medium",
  "ore-trace",
  "water-high",
  "water-medium",
  "water-low",
  "water-trace",
  "gas-low",
  "gas-medium",
  "population-tribal",
  "population-scarce",
  "population-cities",
  "oil-low",
  "oil-medium"
];
//UTILS/RANDOM GENERATORS FILE ========================================
const getRandomString = (Array: string[]) => {
  const randIdx = Math.floor(Math.random() * Array.length);
  return Array[randIdx];
};

const generateRandomNumber = (max: number, min = 1) => {
  return Math.floor(Math.random() * max + min);
};

const getRandomSystemStar = (systemStarArr: string[]) => {
  return getRandomString(systemStarArr);
};

const getRandomPlanet = (planetArr: string[]) => {
  return getRandomString(planetArr);
};

const getRandomResource = (resourceArr: string[], duplicate = "") => {
  let randomResource = getRandomString(resourceArr);
  while (duplicate === randomResource) {
    randomResource = getRandomString(resourceArr);
  }
  return randomResource;
};

const getRandomNumberString = () => {
  const prefixOptions = "A"; // change this variable for each sector
  const value = getRandomString(prefixOptions.split(""));
  const num = generateRandomNumber(90000, 10000);
  return `${value}-${num}`;
};
//================================================

//SYSTEMS GENERATOR FILE =================================
interface System {
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
    cords: getRandomNumberString(),
    ownership: getRandomNumberString(),
    hangar: [],
  };

  const randomPlanetNumber = generateRandomNumber(maxPlanets);

  for (let i = 0; i < randomPlanetNumber; i++) {
    const planetName = getRandomPlanet(planetList);
    const resource1 = getRandomResource(resources);
    const resource2 = getRandomResource(resources, resource1);
    system.systemPlanets[planetName] = [resource1, resource2];
  }

  return system;
};

const generateMultipleSystems = (maxSystems: number, maxPlanets: number) => {
  const randomSystemNumber = generateRandomNumber(maxSystems);
  const systems: System[] = [];

  for (let i = 0; i < randomSystemNumber; i++) {
    const system = generateSystem(maxPlanets);
    systems.push(system);
  }

  console.log(systems)
};
generateMultipleSystems(10, 8)
