export interface Sector {
  systemStar: string;
  systemPlanets: Array<string>;
  systemName: string;
  cords: string;
  id: number;
  hangar: Array<any>;
}

export interface PlayerSystem {
  sector: Sector;
}
