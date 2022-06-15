import { Sector } from '../../../types/system-interfaces';

export const MOCK_SECTOR_ARRAY: Sector[] = [
  {
    systemStar: 'Red-Giant',
    systemPlanets: {
      Ocean2: ['gas-medium', 'population-scarce'],
      Ocean3: ['water-medium', 'ore-high'],
      Lava1: ['ore-trace', 'ore-high'],
      Gas1: ['ore-medium', 'gas-medium'],
      Gas5: ['water-medium', 'water-trace'],
      Desert5: ['oil-low', 'population-tribal'],
      Temperate1: ['ore-high', 'gas-low'],
      Greenhouse1: ['ore-high', 'population-tribal'],
    },
    systemName: 'B-76963',
    cords: 'D-61998',
    ownership: 'F-54674',
    hangar: [],
  },
  {
    systemStar: 'Brown-Dwarf',
    systemPlanets: {
      Gas5: ['ore-high', 'ore-trace'],
      Rocky4: ['ore-high', 'ore-medium'],
      Gas1: ['water-medium', 'ore-trace'],
      Greenhouse1: ['ore-high', 'ore-medium'],
      Rocky1: ['water-medium', 'water-trace'],
      Rocky5: ['oil-medium', 'ore-high'],
      Frozen5: ['ore-trace', 'oil-medium'],
      Frozen3: ['ore-high', 'ore-medium'],
    },
    systemName: 'D-23552',
    cords: 'F-45833',
    ownership: 'F-71582',
    hangar: [],
  },
  {
    systemStar: 'Red-Dwarf',
    systemPlanets: {
      Desert5: ['gas-medium', 'ore-medium'],
      Temperate4: ['water-high', 'water-medium'],
      Gas3: ['oil-low', 'oil-medium'],
      Ocean3: ['population-scarce', 'population-cities'],
      Rocky2: ['ore-high', 'population-tribal'],
      Ocean1: ['ore-trace', 'ore-medium'],
      Greenhouse3: ['ore-high', 'gas-medium'],
      Greenhouse5: ['ore-low', 'ore-high'],
      Rocky5: ['water-medium', 'population-cities'],
    },
    systemName: 'E-18428',
    cords: 'F-25269',
    ownership: 'D-90012',
    hangar: [],
  },
];