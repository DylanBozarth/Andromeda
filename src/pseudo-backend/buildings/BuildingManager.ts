import { BuildingChecks, Buildings, BuildingsMapping, SystemValues } from './Buildings.types';

export type PartialSystemValues = Partial<SystemValues>

const checkMinValues = (
  buildingKey: string,
  buildingSchema: BuildingsMapping,
  systemValues: PartialSystemValues,
) => {
  const buildingToCheck: BuildingChecks = buildingSchema[buildingKey];
  if (buildingToCheck.mins) {
    const minValues = Object.keys(buildingToCheck.mins);
    for (const minValue of minValues) {
      if (systemValues[minValue] < buildingToCheck.mins[minValue]) return false;
    }
  }
  return true;
};

const checkMaxValues = (
  buildingKey: string,
  buildingSchema: BuildingsMapping,
  systemValues: PartialSystemValues,
) => {
  const buildingToCheck: BuildingChecks = buildingSchema[buildingKey];
  if (buildingToCheck.maxs) {
    const maxValues = Object.keys(buildingToCheck.maxs);
    for (const maxValue of maxValues) {
      if (systemValues[maxValue] > buildingToCheck.maxs[maxValue]) return false;
    }
  }
  return true;
};

const doesBuildingPassExclusions = (
  buildingKey: string,
  buildingSchema: BuildingsMapping,
  systemValues: PartialSystemValues,
) => {
  const buildingToCheck: BuildingChecks = buildingSchema[buildingKey];
  if (
    systemValues.planetType &&
    buildingToCheck.exclude?.planetType?.includes(systemValues.planetType)
  ) {
    return false;
  }
  return true;
};

const doesBuildingPassInclusions = (
  buildingKey: string,
  buildingSchema: BuildingsMapping,
  systemValues: PartialSystemValues,
) => {
  const buildingToCheck: BuildingChecks = buildingSchema[buildingKey];
  if (
    buildingToCheck.include &&
    systemValues.planetType &&
    !buildingToCheck.include.planetType?.includes(systemValues.planetType)
  ) {
    return false;
  }
  return true;
};

export class BuildingManager {
  buildingSchema: BuildingsMapping;
  constructor(buildingSchema: BuildingsMapping) {
    this.buildingSchema = buildingSchema;
  }

  getAvailableBuildings(systemValues: PartialSystemValues) {
    const availableBuildings: Array<Buildings> = [];
    for (const buildingKey of Object.keys(this.buildingSchema)) {
      if (
        checkMinValues(buildingKey, this.buildingSchema, systemValues) &&
        checkMaxValues(buildingKey, this.buildingSchema, systemValues) &&
        doesBuildingPassExclusions(buildingKey, this.buildingSchema, systemValues) &&
        doesBuildingPassInclusions(buildingKey, this.buildingSchema, systemValues)
      )
        availableBuildings.push(buildingKey as Buildings);
    }
    return availableBuildings;
  }
}
