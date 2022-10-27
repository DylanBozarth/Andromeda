import { Planet } from '../../types/planet-interface';
import { System } from './generate-sector';
import { baseBuildingPowerValue, baseShipPowerValue, getSystemPower } from './system-power';

const SAMPLE_SYSTEM: System = {
  systemStar: 'Blue-Giant',
  systemName: 'Eoniuqiuq',
  systemPlanets: [
    {
      name: 'Ocean1',
      resources: ['water-medium', 'population-scarce'],
      buildings: ['Inception Base', 'Escort Colony'],
    },
    {
      name: 'Lava2',
      resources: ['ore-trace', 'gas-low'],
      buildings: ['Spectrum Station', 'Dawn Colony'],
    },
    {
      name: 'Lava4',
      resources: ['oil-medium', 'gas-medium'],
      buildings: ['Power Plant', 'Symbolica Colony'],
    },
    {
      name: 'Gas4',
      resources: ['population-tribal', 'water-low'],
      buildings: ['Escort Colony', 'Inception Base'],
    },
    {
      name: 'Rocky3',
      resources: ['population-tribal', 'ore-low'],
      buildings: ['Building 3', 'Building 1'],
    },
    {
      name: 'Gas4',
      resources: ['population-cities', 'oil-medium'],
      buildings: ['Symbolica Colony', 'Escort Colony'],
    },
    {
      name: 'Greenhouse3',
      resources: ['water-high', 'water-trace'],
      buildings: ['Symbolica Colony', 'Inception Base'],
    },
    {
      name: 'Ocean2',
      resources: ['population-cities', 'water-medium'],
      buildings: ['Escort Colony', 'Inception Base'],
    },
  ],
  cords: 'R-4975',
  ownership: 'unowned',
  hangar: ['ship1', 'ship2'],
};

describe('getSystemPower() tests', () => {
  it('getSystemPower() returns correct values when all buildings and ships are of same value', () => {
    expect(getSystemPower(SAMPLE_SYSTEM)).toStrictEqual({
      shipPower: 2 * baseShipPowerValue,
      buildingPower: 16 * baseBuildingPowerValue,
    });
  });
});
