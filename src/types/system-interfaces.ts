export interface Sector {
  systemStar: string;
  systemPlanets: Record<string, Array<string>>;
  systemName: string;
  cords: string;
  ownership: string;
  hangar: Array<any>;
}

export interface PlayerSystem {
  sector: Sector;
}
