import { useGame } from '../../context/GameContext';
import { BigPlanetComponent } from '../../components/bigplanet';
import { PlanetSideBar } from '../../UI/side-bars/planet-side-bar';

export const PlanetView = () => {
  const { activePlanet } = useGame();

  if (!activePlanet) return null;

  return (
    <div className='planet-view-layout'>
      <div className='planet-view-scene'>
        <BigPlanetComponent planet={activePlanet} />
      </div>
      <PlanetSideBar playerPlanet={activePlanet} />
    </div>
  );
};
