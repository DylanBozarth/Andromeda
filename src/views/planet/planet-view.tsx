import '@styles/textures/planets-and-stars.scss';
import { useGame } from '../../context/GameContext';
import { BigPlanetComponent } from '../../components/bigplanet';
import { PlanetSideBar } from '../../UI/side-bars/planet-side-bar';

export const PlanetView = () => {
  const { activePlanet } = useGame();

  if (!activePlanet) return null;

  return (
    <div className='flex'>
      <div className='planet-wrapper'>
        <PlanetSideBar playerPlanet={activePlanet} />
        <BigPlanetComponent planet={activePlanet} />
      </div>
    </div>
  );
};
