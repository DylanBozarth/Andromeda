import { BACKEND_URL } from '../clientLibrary/backendURL';
import { getToken } from '../clientLibrary/localStorage';
import { Fleet, Ship, BuildShipRequest, CreateFleetRequest, AssignShipToFleetRequest } from './types';

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function fetchFleets(): Promise<Fleet[]> {
  const resp = await fetch(`${BACKEND_URL}/fleets`, { headers: authHeaders() });
  if (!resp.ok) throw new Error('Failed to fetch fleets');
  const data = await resp.json();
  return data.fleets;
}

export async function fetchHangar(
  sectorName: string,
  systemName: string,
  planetName: string,
): Promise<Ship[]> {
  const resp = await fetch(
    `${BACKEND_URL}/fleets/hangar/${sectorName}/${systemName}/${planetName}`,
    { headers: authHeaders() },
  );
  if (!resp.ok) throw new Error('Failed to fetch hangar');
  const data = await resp.json();
  return data.ships;
}

export async function fetchShipProduction(
  sectorName: string,
  systemName: string,
  planetName: string,
): Promise<Ship[]> {
  const resp = await fetch(
    `${BACKEND_URL}/fleets/production/${sectorName}/${systemName}/${planetName}`,
    { headers: authHeaders() },
  );
  if (!resp.ok) throw new Error('Failed to fetch ship production');
  const data = await resp.json();
  return data.ships;
}

export async function buildShip(req: BuildShipRequest): Promise<Ship> {
  const resp = await fetch(`${BACKEND_URL}/fleets/build-ship`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      sector_name: req.sectorName,
      system_name: req.systemName,
      planet_name: req.planetName,
      ship_type: req.shipType,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Failed to build ship');
  }
  return resp.json();
}

export async function createFleet(req: CreateFleetRequest): Promise<Fleet> {
  const resp = await fetch(`${BACKEND_URL}/fleets/create`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name: req.name, ship_ids: req.shipIds }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Failed to create fleet');
  }
  return resp.json();
}

export async function assignShipToFleet(req: AssignShipToFleetRequest): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/fleets/assign-ship`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ ship_id: req.shipId, fleet_id: req.fleetId }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Failed to assign ship');
  }
}

export async function disbandFleet(fleetId: string): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/fleets/${fleetId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Failed to disband fleet');
  }
}
