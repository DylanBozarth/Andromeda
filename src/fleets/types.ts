export type FleetStatus = 'idle' | 'in-transit' | 'in-battle' | 'retreating';

export interface Ship {
  id: string;
  type: string;
  name: string;
  power: number;
  maxPower: number;
  builtAt: string;
  owner: string;
  status: 'constructing' | 'complete';
  startedAt: string | null;
  durationSeconds: number;
}

export interface Fleet {
  id: string;
  name: string;
  owner: string;
  ships: Ship[];
  status: FleetStatus;
  location: string | null; // system name or null if in transit
  destination: string | null;
  power: number;
  maxPower: number;
}

export interface FleetState {
  fleets: Fleet[];
  maxFleets: number; // always 10
}

export interface BuildShipRequest {
  sectorName: string;
  systemName: string;
  planetName: string;
  shipType: string;
}

export interface AssignShipToFleetRequest {
  shipId: string;
  fleetId: string;
}

export interface CreateFleetRequest {
  name: string;
  shipIds: string[];
}
