import { generateRandomNumber } from '../math';

const getRandomString = (arr: string[]) => {
  const randIdx = Math.floor(Math.random() * arr.length);
  return arr[randIdx];
};

export const getRandomSystemStar = (systemStarArr: string[]) => {
  return getRandomString(systemStarArr);
};

export const getRandomNCO = (NCOArr: string[]) => {
  return getRandomString(NCOArr);
};

export const getSystemCoords = (systemLetter: string) => {
  const x = generateRandomNumber(90, -20);
  const y = generateRandomNumber(90, -10);
  const z = generateRandomNumber(90, -20);
  return `${systemLetter}-${x}_${y}_${z}`;
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
  const prefixOptions = 'A';
  const value = getRandomString(prefixOptions.split(''));
  const num = generateRandomNumber(9000, 1000);
  return `${value}-${num}`;
};

export const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  const x = x2 - x1;
  const y = y2 - y1;
  return Math.round(Math.sqrt(x * x + y * y));
};

/** Parse 3-axis coords from new format "R-x_y_z" or fall back to old "R-XXYY" */
export const parseCoords = (cords: string, fallbackName = ''): { x: number; y: number; z: number } => {
  // new format: "X-num_num_num"
  const newFmt = cords.match(/^[A-Z]-(-?\d+)_(-?\d+)_(-?\d+)$/);
  if (newFmt) {
    return { x: +newFmt[1], y: +newFmt[2], z: +newFmt[3] };
  }
  // old format: "X-XXYY" (fixed 2-char slices after the dash)
  const body = cords.slice(2);
  const x = +body.slice(0, 2);
  const y = +body.slice(2, 4);
  // deterministic Z from name so old data isn't flat
  let h = 0;
  for (let i = 0; i < fallbackName.length; i++) h = (h * 31 + fallbackName.charCodeAt(i)) & 0xffff;
  const z = (h % 110) - 20;
  return { x, y, z };
};

// kept for backward compat with distance map generation
export const getXfromCords = (cords: string) => parseCoords(cords).x.toString();
export const getYfromCords = (cords: string) => parseCoords(cords).y.toString();
export const parseOutXandYfromCords = (cords: string) => {
  const { x, y } = parseCoords(cords);
  return { x, y };
};
