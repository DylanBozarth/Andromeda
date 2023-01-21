import { BuildingsMapping, PlanetTypes } from './Buildings.types';

export const buildingsMapping: BuildingsMapping = {
  coalPlant: {
    mins: {
      currency: 100,
      coal: 50,
    },
    exclude: {
      planetType: [PlanetTypes.Gaia],
    },
  },
  nukePlant: {
    mins: {
      currency: 200,
      uranium: 20,
    },
    include: {
      planetType: [PlanetTypes.Radioactive],
    },
  },
  hydroponicFarm: {
    mins: {
      currency: 20,
    },
  },
};
