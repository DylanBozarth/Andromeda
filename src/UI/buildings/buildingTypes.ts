export interface BuildingDef {
  type: string;
  displayName: string;
  description: string;
  icon: string;
  maxLevel: number;
}

export const BUILDING_TYPES: BuildingDef[] = [
  {
    type: 'settlement',
    displayName: 'Settlement',
    description: 'A basic colony structure. Houses workers and provides administrative capacity.',
    icon: '🏘',
    maxLevel: 5,
  },
  {
    type: 'mine',
    displayName: 'Mine',
    description: 'Extracts raw minerals from the planet surface.',
    icon: '⛏',
    maxLevel: 5,
  },
  {
    type: 'factory',
    displayName: 'Factory',
    description: 'Processes raw minerals into usable materials.',
    icon: '🏭',
    maxLevel: 5,
  },
  {
    type: 'shipyard',
    displayName: 'Shipyard',
    description: 'Constructs and repairs ships in orbit.',
    icon: '🚀',
    maxLevel: 3,
  },
  {
    type: 'defense_turret',
    displayName: 'Defense Turret',
    description: 'Provides orbital defense against incoming fleets.',
    icon: '🛡',
    maxLevel: 5,
  },
];
