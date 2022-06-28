import { System } from '../../../utils/system-generator/generate-sector';

export const MOCK_SECTOR_ARRAY: System[] = [
  {
    systemStar: 'Red-Giant',
    systemPlanets: [ 
      { name: 'Gas2', resources: ['water-high', 'oil-medium'], buildings: ['building 1', 'building 2'] },
      { name: 'Greenhouse1', resources: ['gas-medium', 'ore-trace'], buildings: ['building 3', 'building 2'] }
    ],
    systemName: 'A-5250',
    cords: 'A-4833',
    ownership: 'unowned',
    hangar: [],
  },
  {
    systemStar: 'Brown-Dwarf',
    systemPlanets: [
      { name: 'Gas5', resources: ['ore-high', 'ore-trace'], buildings: ['Chemical plant', 'Dawn Colony'] },
      { name: 'Rocky4', resources: ['ore-high', 'ore-medium'], buildings: ['Spectrum Station', 'Escort Colony'] },
      { name: 'Gas1', resources: ['water-medium', 'ore-trace'], buildings: ['building 3', 'building 2'] },
      { name: 'Greenhouse1', resources: ['ore-high', 'ore-medium'], buildings: ['Inception Base', 'Symbolica Colony'] },
      { name: 'Rocky1', resources: ['water-medium', 'water-trace'] , buildings: ['Spectrum Station', 'Escort Colony'] },
      { name: 'Rocky5', resources: ['oil-medium', 'ore-high'], buildings: ['Chemical plant', 'Dawn Colony'] },
      { name: 'Frozen5', resources: ['ore-trace', 'oil-medium'], buildings: ['building 3', 'building 2'] },
      { name: 'Frozen3', resources: ['ore-high', 'ore-medium'], buildings: ['building 1', 'building 2'] },
    ],
    systemName: 'A-2355',
    cords: 'A-4583',
    ownership: 'unowned',
    hangar: [],
  },
  {
    systemStar: 'Red-Dwarf',
    systemPlanets: [
      { name: 'Desert5', resources: ['gas-medium', 'ore-medium'], buildings: ['Spectrum Station', 'Escort Colony'] },
      { name: 'Temperate4', resources: ['water-high', 'water-medium'], buildings: ['Power Plant', 'Building 1'] },
      { name: 'Gas3', resources: ['oil-low', 'oil-medium'], buildings: ['Building 2', 'Escort Colony'] },
      { name: 'Ocean3', resources: ['population-scarce', 'population-cities'], buildings: ['Chemical plant', 'Dawn Colony'] },
      { name: 'Rocky2', resources: ['ore-high', 'population-tribal'], buildings: ['Spectrum Station', 'Escort Colony'] },
      { name: 'Ocean1', resources: ['ore-trace', 'ore-medium'], buildings: ['Inception Base', 'Escort Colony'] },
      { name: 'Greenhouse3', resources: ['ore-high', 'gas-medium'], buildings: ['Building 2', 'Escort Colony'] },
      { name: 'Greenhouse5', resources: ['ore-low', 'ore-high'], buildings: ['Building 1', 'Symbolica Colony'] },
      { name: 'Rocky5', resources: ['water-medium', 'population-cities'], buildings: ['Building 3', 'Chemical plant'] },
    ],
    systemName: 'A-1842',
    cords: 'A-2526',
    ownership: 'A-9001',
    hangar: [],
  },
  {
    systemStar: 'Brown-Dwarf',
    systemPlanets: [
      { name: 'Temperate4', resources: ['water-trace', 'ore-high'], buildings: ['Spectrum Station', 'Escort Colony'] },
      { name: 'Rocky4', resources: ['population-tribal', 'ore-trace'], buildings: ['Chemical plant', 'Dawn Colony'] },
      { name: 'Lava1', resources: ['water-trace', 'ore-high'], buildings: ['Spectrum Station', 'Escort Colony'] },
      { name: 'Temperate5', resources: ['water-low', 'ore-trace'], buildings: ['Spectrum Station', 'Escort Colony'] },
      { name: 'Ocean5', resources: ['ore-trace', 'oil-low'], buildings: ['building 3', 'building 2'] },
      { name: 'Desert5', resources: ['water-trace', 'population-cities'], buildings: ['building 3', 'building 2'] },
    ],
    systemName: 'A-8438',
    cords: 'A-8659',
    ownership: 'unowned',
    hangar: [],
  },
  {
    systemStar: 'Yellow-Dwarf',
    systemPlanets: [
      { name: 'Ocean4', resources: ['water-low', 'ore-medium'], buildings: ['building 3', 'building 2'] },
    ],
    systemName: 'A-1664',
    cords: 'A-2756',
    ownership: 'unowned',
    hangar: [],
  },
];
