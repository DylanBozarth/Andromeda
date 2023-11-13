import { generateRandomNumber } from '../math';

const getRandomString = (arr: string[]) => {
  const randIdx = Math.floor(Math.random() * arr.length);
  return arr[randIdx];
};

export const getRandomSystemStar = (systemStarArr: string[]) => {
  return getRandomString(systemStarArr);
};

export const getRandomNCO = (NCOArr: string[]) => {
  return getRandomString(NCOArr)
}
export const getSystemCoords = (systemLetter: string) => {
  return `${systemLetter}-${generateRandomNumber(90, -20)}${generateRandomNumber(90, -10)}`;
};

export const getRandomPlanet = (planetArr: string[]) => {
  return getRandomString(planetArr);
};

export const getRandomResource = (resourceArr: string[], duplicate = '') => {
  let randomResource = getRandomString(resourceArr);
  while (duplicate === randomResource) {
    randomResource = getRandomString(resourceArr);
  }
  return randomResource;
};

export const getRandomBuildings = (resourceArr: string[], duplicate = '') => {
  let randomBuilding = getRandomString(resourceArr);
  while (duplicate === randomBuilding) {
    randomBuilding = getRandomString(resourceArr);
  }
  return randomBuilding;
};

export const getRandomNumberString = () => {
  const prefixOptions = 'A'; // change this variable for sector initial
  const value = getRandomString(prefixOptions.split(''));
  const num = generateRandomNumber(9000, 1000);
  return `${value}-${num}`;
};

export const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const x = x2 - x1;
  const y = y2 - y1;
  return Math.round(Math.sqrt(x * x + y * y));
};

export const getXfromCords = (cords: string) => {
  return cords.slice(2, 4);
};

export const getYfromCords = (cords: string) => {
  return cords.slice(4, 6);
};

export const parseOutXandYfromCords = (cords: string) => {
  return {
    x: +getXfromCords(cords),
    y: +getYfromCords(cords),
  };
};
