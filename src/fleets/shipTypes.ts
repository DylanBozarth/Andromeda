export interface ShipDef {
  type: string;
  displayName: string;
  description: string;
  icon: string;
  power: number;
  buildTimeSeconds: number;
  requiresBuilding: string; // building type required on the planet
}

export const SHIP_TYPES: ShipDef[] = [
  {
    type: 'scout',
    displayName: 'Scout',
    description: 'Fast recon vessel. Low combat power but reveals enemy fleet positions.',
    icon: '🛸',
    power: 10,
    buildTimeSeconds: 60,
    requiresBuilding: 'settlement',
  },
  {
    type: 'fighter',
    displayName: 'Fighter',
    description: 'Balanced attack craft. The backbone of most fleets.',
    icon: '✈️',
    power: 30,
    buildTimeSeconds: 180,
    requiresBuilding: 'factory',
  },
  {
    type: 'destroyer',
    displayName: 'Destroyer',
    description: 'Heavy warship effective against fighters and installations.',
    icon: '🚀',
    power: 60,
    buildTimeSeconds: 600,
    requiresBuilding: 'shipyard',
  },
  {
    type: 'cruiser',
    displayName: 'Cruiser',
    description: 'Capital ship with massive firepower and durable hull.',
    icon: '🛡',
    power: 150,
    buildTimeSeconds: 1800,
    requiresBuilding: 'shipyard',
  },
];
