import { System } from './generate-sector';
import { useState } from 'react';
export interface ShipInterface {
  name: string;
  armor: number;
  manpower: number;
  fuel: number;
  hull: number;
  munitions: number;
  buildTime: number;
  weapons: Array<number>;
  cost: Array<object>;
}

export const ship1: ShipInterface = {
  name: 'The Buzzard',
  armor: 500,
  manpower: 900,
  fuel: 200,
  hull: 600,
  munitions: 75,
  buildTime: 10,
  weapons: [590, 200],
  cost: [{'minerals': 1000}],
};

export const buildShip = (system: System) => {
  setTimeout(() => {
     system.hangar.push(...[ship1]);
  }, ship1.buildTime);
};