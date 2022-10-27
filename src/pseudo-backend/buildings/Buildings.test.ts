import buildingManager from '..';
import { Buildings, PlanetTypes } from './Buildings.types';

const isBuildingAvailable = (availableBuildings: Buildings[], buildingType: Buildings) =>
  availableBuildings.includes(buildingType);

const isNukePlantAvailable = (availableBuildings: Buildings[]) =>
  isBuildingAvailable(availableBuildings, Buildings.NukePlant);

const isCoalPlantAvailable = (availableBuildings: Buildings[]) =>
  isBuildingAvailable(availableBuildings, Buildings.CoalPlant);

describe('getAvailableBuildings() BuildingManager method', () => {
  describe('NukePlant', () => {
    it('NukePlant is available for Radioactive planet with enough uranium', () => {
      const availableBuildings = buildingManager.getAvailableBuildings({
        planetType: PlanetTypes.Radioactive,
        uranium: 21,
      });
      expect(isNukePlantAvailable(availableBuildings)).toBe(true);
    });
    it('NukePlant is not available for Radioactive planet with not enough uranium', () => {
      const availableBuildings = buildingManager.getAvailableBuildings({
        planetType: PlanetTypes.Radioactive,
        uranium: 19,
      });
      expect(isNukePlantAvailable(availableBuildings)).toBe(false);
    });
    it('NukePlant is not available for non-Radioactive planet with enough uranium', () => {
      const availableBuildings = buildingManager.getAvailableBuildings({
        planetType: PlanetTypes.Gaia,
        uranium: 21,
      });
      expect(isNukePlantAvailable(availableBuildings)).toBe(false);
    });
  });
  describe('CoalPlant', () => {
    it('CoalPlant is available for non-Gaia planet with enough coal', () => {
      const availableBuildings = buildingManager.getAvailableBuildings({
        planetType: PlanetTypes.Radioactive,
        coal: 51,
      });
      expect(isCoalPlantAvailable(availableBuildings)).toBe(true);
    });
    it('CoalPlant is NOT available for non-Gaia planet with NOT enough coal', () => {
      const availableBuildings = buildingManager.getAvailableBuildings({
        planetType: PlanetTypes.Radioactive,
        coal: 49,
      });
      expect(isCoalPlantAvailable(availableBuildings)).toBe(false);
    });
  });
  it('CoalPlant is NOT available for Gaia planet', () => {
    const availableBuildings = buildingManager.getAvailableBuildings({
      planetType: PlanetTypes.Gaia,
      coal: 51,
    });
    expect(isCoalPlantAvailable(availableBuildings)).toBe(false);
  });
});
