import { useState, useCallback } from 'react';
import { Fleet, Ship } from './types';
import { fetchFleets, fetchHangar, buildShip, createFleet, disbandFleet } from './clientLibrary';

export const MAX_FLEETS = 10;

export function useFleets() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFleets();
      setFleets(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load fleets');
    } finally {
      setLoading(false);
    }
  }, []);

  const makeFleet = useCallback(async (name: string, shipIds: string[]) => {
    if (fleets.length >= MAX_FLEETS) throw new Error(`Fleet limit reached (${MAX_FLEETS})`);
    const fleet = await createFleet({ name, shipIds });
    setFleets(prev => [...prev, fleet]);
    return fleet;
  }, [fleets.length]);

  const removeFleet = useCallback(async (fleetId: string) => {
    await disbandFleet(fleetId);
    setFleets(prev => prev.filter(f => f.id !== fleetId));
  }, []);

  return { fleets, loading, error, atLimit: fleets.length >= MAX_FLEETS, refresh, makeFleet, removeFleet };
}

export function useHangar(sectorName: string, systemName: string, planetName: string) {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buildPending, setBuildPending] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!sectorName || !systemName || !planetName) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHangar(sectorName, systemName, planetName);
      setShips(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load hangar');
    } finally {
      setLoading(false);
    }
  }, [sectorName, systemName, planetName]);

  const orderShip = useCallback(async (shipType: string) => {
    setBuildPending(shipType);
    setError(null);
    try {
      const ship = await buildShip({ sectorName, systemName, planetName, shipType });
      setShips(prev => [...prev, ship]);
      return ship;
    } catch (err: any) {
      setError(err.message ?? 'Failed to build ship');
      throw err;
    } finally {
      setBuildPending(null);
    }
  }, [sectorName, systemName, planetName]);

  return { ships, loading, error, buildPending, refresh, orderShip };
}
