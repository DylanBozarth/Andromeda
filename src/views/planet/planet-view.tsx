import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BigPlanetComponent } from '../../components/bigplanet';
import { PlanetSideBar } from '../../UI/side-bars/planet-side-bar';
import { BuildingMenu } from '../../UI/buildings/BuildingMenu';
import { fetchPlanetBuildings, PlanetBuilding } from '../../clientLibrary/buildings';

export const PlanetView = () => {
  const { activePlanet, sector, activeSystem } = useGame();
  const [buildMenuOpen, setBuildMenuOpen] = useState(false);
  const [buildings, setBuildings] = useState<PlanetBuilding[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sectorName = sector?.sectorName ?? '';
  const systemName = activeSystem?.systemName ?? '';
  const planetName = activePlanet?.name ?? '';

  const refresh = async () => {
    if (!sectorName || !systemName || !planetName) return;
    try {
      const data = await fetchPlanetBuildings(sectorName, systemName, planetName);
      setBuildings(data);
    } catch {}
  };

  useEffect(() => {
    refresh();
  }, [sectorName, systemName, planetName]);

  // poll every 5s while anything is constructing
  useEffect(() => {
    const hasConstructing = buildings.some(b => b.status === 'constructing');
    if (hasConstructing) {
      pollRef.current = setInterval(refresh, 5000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [buildings]);

  if (!activePlanet) return null;

  return (
    <div className='planet-view-layout'>
      <div className='planet-view-scene'>
        <BigPlanetComponent planet={activePlanet} />
      </div>

      <button
        className='buildings-tab-trigger'
        onClick={() => setBuildMenuOpen(true)}
        title='Buildings'
      >
        Buildings
      </button>

      <PlanetSideBar playerPlanet={activePlanet} buildings={buildings} />

      {buildMenuOpen && (
        <BuildingMenu
          onClose={() => setBuildMenuOpen(false)}
          buildings={buildings}
          onBuildStart={refresh}
          sectorName={sectorName}
          systemName={systemName}
          planetName={planetName}
        />
      )}
    </div>
  );
};
