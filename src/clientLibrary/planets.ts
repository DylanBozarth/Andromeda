import { BACKEND_URL } from './backendURL';
import { getToken } from './localStorage';

export async function claimPlanet(
  sectorName: string,
  systemName: string,
  planetName: string,
): Promise<{ claimed: string }> {
  const resp = await fetch(`${BACKEND_URL}/claim-planet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      sector_name: sectorName,
      system_name: systemName,
      planet_name: planetName,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Failed to claim planet');
  }

  return resp.json();
}
