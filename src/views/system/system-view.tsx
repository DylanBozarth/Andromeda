import { PlanetComponent } from '../../components/planet';
import { useGame } from '../../context/GameContext';
import { Link } from 'react-router-dom';
import { SystemSideBar } from '../../UI/side-bars/system-side-bar';

export const SystemView = () => {
  const { sector, activeSystem, setActivePlanet } = useGame();

  if (!activeSystem || !sector) return null;

  return (
    <div className=''>
      <SystemSideBar />
      <div className='flex flex-wrap justify-center mt-20'>
        {activeSystem.systemPlanets.map((planet) => (
          <div key={planet.name} className='planet-wrapper p-10'>
            <Link
              to={`/${sector.sectorName}/system/${activeSystem.systemName}/planet/${planet.name}`}
              onClick={() => setActivePlanet(planet)}
            >
              <PlanetComponent planet={planet} />
            </Link>
            <p className='text-center'>
              {planet.name}<br />{planet.ownership}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
