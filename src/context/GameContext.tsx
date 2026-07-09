import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BACKEND_URL } from '../clientLibrary/backendURL';
import { getToken } from '../redux/localStorage';
import { AuthContext } from '../non-game-pages/AuthProvider/context/AuthContext';
import { DistanceMap, System, NCO } from '../utils/system-generator/generate-sector';
import { Planet } from '../types/planet-interface';

export interface Sector {
  systems: System[];
  NCO: NCO[];
  distancesMap: DistanceMap;
  sectorName: string;
  fleetsInTransit: string[];
}

interface GameState {
  sector: Sector | null;
  sectorLoading: boolean;
  activeSystem: System | null;
  activePlanet: Planet | null;
  activeNCO: NCO | null;
  fetchSector: () => Promise<void>;
  setActiveSystem: (system: System) => void;
  setActivePlanet: (planet: Planet) => void;
  setActiveNCO: (nco: NCO) => void;
}

const GameContext = createContext<GameState>({} as GameState);

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [sector, setSector] = useState<Sector | null>(null);
  const [sectorLoading, setSectorLoading] = useState(false);
  const [activeSystem, setActiveSystem] = useState<System | null>(null);
  const [activePlanet, setActivePlanet] = useState<Planet | null>(null);
  const [activeNCO, setActiveNCO] = useState<NCO | null>(null);

  const fetchSector = async () => {
    setSectorLoading(true);
    try {
      const token = getToken();
      const resp = await fetch(`${BACKEND_URL}/sectors/sector-a`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setSector(data);
    } catch (err) {
      console.error('Failed to fetch sector:', err);
    } finally {
      setSectorLoading(false);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchSector();
    } else {
      setSector(null);
    }
  }, [user]);

  return (
    <GameContext.Provider value={{
      sector,
      sectorLoading,
      activeSystem,
      activePlanet,
      activeNCO,
      fetchSector,
      setActiveSystem,
      setActivePlanet,
      setActiveNCO,
    }}>
      {children}
    </GameContext.Provider>
  );
};
