import { generateRandomNumber } from '../math';

const getRandomString = (arr: string[]) => {
  const randIdx = Math.floor(Math.random() * arr.length);
  return arr[randIdx];
};

export const getRandomSystemStar = (systemStarArr: string[]) => {
  return getRandomString(systemStarArr);
};

export const getSystemCoords = (systemLetter: string) => {
  return `${systemLetter}-${generateRandomNumber(80, 20)}${generateRandomNumber(80, 20)}`;
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

export const getRandomNumberString = () => {
  const prefixOptions = 'A'; // change this variable for sector initial
  const value = getRandomString(prefixOptions.split(''));
  const num = generateRandomNumber(9000, 1000);
  return `${value}-${num}`;
};
