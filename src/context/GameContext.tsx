import { createContext, useContext, useState, ReactNode } from 'react';
import { DistanceMap, System, NCO } from '../utils/system-generator/generate-sector';
import { Planet } from '../types/planet-interface';
import type { Moon } from '../types/moon-interface';
import solSystemData from '../data/sol-system.json';

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
  activeMoon: Moon | null;
  fetchSector: () => Promise<void>;
  setActiveSystem: (system: System) => void;
  setActivePlanet: (planet: Planet) => void;
  setActiveNCO: (nco: NCO) => void;
  setActiveMoon: (moon: Moon) => void;
}

const GameContext = createContext<GameState>({} as GameState);

export const useGame = () => useContext(GameContext);

const solSystem = solSystemData as System;
const solSector: Sector = {
  sectorName: 'sol',
  systems: [solSystem],
  NCO: [],
  distancesMap: { Sol: {} },
  fleetsInTransit: [],
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [sector] = useState<Sector>(solSector);
  const [activeSystem, setActiveSystem] = useState<System | null>(solSystem);
  const [activePlanet, setActivePlanet] = useState<Planet | null>(null);
  const [activeNCO, setActiveNCO] = useState<NCO | null>(null);
  const [activeMoon, setActiveMoon] = useState<Moon | null>(null);

  const fetchSector = async () => {};

  return (
    <GameContext.Provider value={{
      sector,
      sectorLoading: false,
      activeSystem,
      activePlanet,
      activeNCO,
      activeMoon,
      fetchSector,
      setActiveSystem,
      setActivePlanet,
      setActiveNCO,
      setActiveMoon,
    }}>
      {children}
    </GameContext.Provider>
  );
};
