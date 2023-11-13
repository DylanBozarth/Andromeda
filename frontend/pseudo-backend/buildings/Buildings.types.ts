export interface SystemValues extends Record<ResourceTypes, number> {
  planetType: PlanetTypes;
  currency: number;
}

export enum Buildings {
  CoalPlant = 'coalPlant',
  NukePlant = 'nukePlant',
  HydroponicFarm = 'hydroponicFarm',
}

export enum PlanetTypes {
  Gaia = 'gaia',
  Radioactive = 'radioactive',
}

export enum ResourceTypes {
  Currency = 'currency',
  Coal = 'coal',
  Uranium = 'uranium',
}

export interface BuildingChecks {
  mins?: Partial<Record<ResourceTypes, number>>;
  maxs?: Partial<Record<ResourceTypes, number>>;
  exclude?: {
    planetType?: Array<PlanetTypes>;
  };
  include?: {
    planetType?: Array<PlanetTypes>;
  };
}

export type BuildingsMapping = Record<Buildings, BuildingChecks>;
