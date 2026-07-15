import { BACKEND_URL } from './backendURL';
import { getToken } from './localStorage';

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

export interface BuildingType {
  type: string;
  displayName: string;
  description: string;
  maxLevel: number;
}

export interface PlanetBuilding {
  buildingType: string;
  level: number;
  owner: string;
  status: 'constructing' | 'queued' | 'complete';
  startedAt: string | null;
  durationSeconds: number;
  queuePosition: number | null;
}

export async function fetchBuildingTypes(): Promise<BuildingType[]> {
  const resp = await fetch(`${BACKEND_URL}/buildings/types`, { headers: authHeaders() });
  if (!resp.ok) throw new Error('Failed to fetch building types');
  const data = await resp.json();
  return data.buildings;
}

export async function fetchPlanetBuildings(
  sectorName: string,
  systemName: string,
  planetName: string,
): Promise<PlanetBuilding[]> {
  const resp = await fetch(
    `${BACKEND_URL}/buildings/planet/${sectorName}/${systemName}/${planetName}`,
    { headers: authHeaders() },
  );
  if (!resp.ok) throw new Error('Failed to fetch planet buildings');
  const data = await resp.json();
  return data.buildings;
}

export async function cancelBuilding(
  sectorName: string,
  systemName: string,
  planetName: string,
  buildingType: string,
): Promise<void> {
  const resp = await fetch(`${BACKEND_URL}/buildings/cancel`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      sector_name: sectorName,
      system_name: systemName,
      planet_name: planetName,
      building_type: buildingType,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Failed to cancel build');
  }
}

export async function constructBuilding(
  sectorName: string,
  systemName: string,
  planetName: string,
  buildingType: string,
): Promise<{ buildingType: string; level: number }> {
  const resp = await fetch(`${BACKEND_URL}/buildings/build`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      sector_name: sectorName,
      system_name: systemName,
      planet_name: planetName,
      building_type: buildingType,
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Failed to construct building');
  }
  return resp.json();
}
