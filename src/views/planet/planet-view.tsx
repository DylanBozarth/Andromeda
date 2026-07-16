import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BigPlanetComponent } from '../../components/bigplanet';
import { PlanetSideBar } from '../../UI/side-bars/planet-side-bar';
import { BuildingMenu } from '../../UI/buildings/BuildingMenu';
import { fetchPlanetBuildings, cancelBuilding, PlanetBuilding } from '../../clientLibrary/buildings';
import { fetchShipProduction } from '../../fleets/clientLibrary';
import { Ship } from '../../fleets/types';

export const PlanetView = () => {
  const { activePlanet, sector, activeSystem } = useGame();
  const [buildMenuOpen, setBuildMenuOpen] = useState(false);
  const [buildings, setBuildings] = useState<PlanetBuilding[]>([]);
  const [shipsInProduction, setShipsInProduction] = useState<Ship[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sectorName = sector?.sectorName ?? '';
  const systemName = activeSystem?.systemName ?? '';
  const planetName = activePlanet?.name ?? '';

  const refresh = async () => {
    if (!sectorName || !systemName || !planetName) return;
    try {
      const [buildingData, shipData] = await Promise.all([
        fetchPlanetBuildings(sectorName, systemName, planetName),
        fetchShipProduction(sectorName, systemName, planetName),
      ]);
      setBuildings(buildingData);
      setShipsInProduction(shipData);
    } catch {}
  };

  useEffect(() => {
    refresh();
  }, [sectorName, systemName, planetName]);

  useEffect(() => {
    const hasActive =
      buildings.some(b => b.status === 'constructing' || b.status === 'queued') ||
      shipsInProduction.length > 0;
    if (hasActive) {
      pollRef.current = setInterval(refresh, 5000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [buildings, shipsInProduction]);

  if (!activePlanet) return null;

  return (
    <div className='planet-view-layout'>
      <div className='planet-view-scene'>
        <BigPlanetComponent planet={activePlanet} />
      </div>

      <button
        className='buildings-tab-trigger'
        style={{ display: 'none' }}
        onClick={() => setBuildMenuOpen(true)}
        title='Buildings'
      >
        Buildings
      </button>

      <PlanetSideBar
        playerPlanet={activePlanet}
        buildings={buildings}
        shipsInProduction={shipsInProduction}
        onCancelBuild={async (type) => {
          await cancelBuilding(sectorName, systemName, planetName, type);
          await refresh();
        }}
        onShipBuilt={refresh}
      />

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
