import { Planet } from './planet-interface';

export interface Sector {
  systemStar: string;
  systemPlanets: Array<Planet>;
  systemName: string;
  cords: string;
  ownership: string;
  hangar: Array<any>;
}

export interface PlayerSystem {
  sector: Sector;
}
