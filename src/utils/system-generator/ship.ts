import { System } from './generate-sector';

export interface ShipInterface {
  name: string;
  power: number;
  shield: number;
  attack: number;
  hull: number;
  navigation: number;
  buildTime: number;
  cost: number;
}

export const ship1: ShipInterface = {
  name: 'The Buzzard',
  power: 500,
  shield: 900,
  attack: 200,
  hull: 600,
  navigation: 75,
  buildTime: 5,
  cost: 1000,
};

export const buildShip = (system: System) => {
  setTimeout(() => {
    system.hangar.push(ship1);
  }, ship1.buildTime);
};
