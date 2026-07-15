import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BigPlanetComponent } from '../../components/bigplanet';
import { PlanetSideBar } from '../../UI/side-bars/planet-side-bar';
import { BuildingMenu } from '../../UI/buildings/BuildingMenu';

export const PlanetView = () => {
  const { activePlanet, sector, activeSystem } = useGame();
  const [buildMenuOpen, setBuildMenuOpen] = useState(false);

  if (!activePlanet) return null;

  return (
    <div className='planet-view-layout'>
      <div className='planet-view-scene'>
        <BigPlanetComponent planet={activePlanet} />
      </div>

      {/* trigger tab pinned to left edge of the sidebar */}
      <button
        className='buildings-tab-trigger'
        onClick={() => setBuildMenuOpen(true)}
        title='Buildings'
      >
        Buildings
      </button>

      <PlanetSideBar playerPlanet={activePlanet} />

      {buildMenuOpen && (
        <BuildingMenu
          onClose={() => setBuildMenuOpen(false)}
          sectorName={sector?.sectorName ?? ''}
          systemName={activeSystem?.systemName ?? ''}
          planetName={activePlanet.name}
        />
      )}
    </div>
  );
};
