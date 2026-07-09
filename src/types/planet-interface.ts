export interface PopulationSlot {
  slotId: number;
  occupant: string | null; // username, or null if empty
}

export interface Planet {
  name: string;
  class: string;
  buildings: Array<string>;
  naturalResources: Array<string>;
  resourceStorage: Array<string>;
  production: [];
  hangar: Array<string>;
  orbit: Array<string>;
  populationSlots: PopulationSlot[];
}
