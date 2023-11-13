import { BuildingManager } from './buildings/BuildingManager';
import { buildingsMapping } from './buildings/Buildings.constants';

const buildingManager = new BuildingManager(buildingsMapping);
export default buildingManager;
