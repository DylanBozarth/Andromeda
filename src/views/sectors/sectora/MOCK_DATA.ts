import { Sector } from '../../../types/system-interfaces';

export const MOCK_SECTOR_ARRAY: Sector[] = [
  {
    systemStar: 'Red-Giant',
    systemPlanets: {
      Gas2: [
        'water-high',
        'oil-medium'
      ],
      Greenhouse1: [
        'gas-medium',
        'ore-trace'
      ]
    },
    systemName: 'A-5250',
    cords: 'A-4833',
    ownership: 'unowned',
    hangar: []
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
    systemName: 'A-2355',
    cords: 'A-4583',
    ownership: 'unowned',
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
    systemName: 'A-1842',
    cords: 'A-2526',
    ownership: 'A-9001',
    hangar: [],
  },
  {
    systemStar: 'Brown-Dwarf',
    systemPlanets: {
      Temperate4: [
        'water-trace',
        'ore-high'
      ],
      Rocky4: [
        'population-tribal',
        'ore-trace'
      ],
      Lava1: [
        'water-low',
        'gas-low'
      ],
      Temperate5: [
        'water-low',
        'ore-trace'
      ],
      Ocean5: [
        'ore-trace',
        'oil-low'
      ],
      Desert5: [
        'water-trace',
        'population-cities'
      ]
    },
    systemName: 'A-8438',
    cords: 'A-8659',
    ownership: 'unowned',
    hangar: []
  },
  {
    systemStar: 'Yellow-Dwarf',
    systemPlanets: {
      Ocean4: [
        'water-low',
        'ore-medium'
      ]
    },
    systemName: 'A-1664',
    cords: 'A-2756',
    ownership: 'unowned',
    hangar: []
  }
];
