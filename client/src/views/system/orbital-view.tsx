import { PlanetComponent } from '../../components/planet';
import '../../styles/views-styles/system-view.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Link } from 'react-router-dom';
import { setPlanet } from '../../redux/sectorSlice';
import { SystemSideBar } from '../../UI/side-bars/system-side-bar';
import { Star } from '../../components/star';
import { BigStar } from '../../components/bigStar';

export const SystemOrbitalView = () => {
  const dispatch = useAppDispatch();
  const sector = useAppSelector((state) => state.sector.activeSector.sector);
  const playerSystem = useAppSelector((state) => state.sector.activeSystem);
  return (
    <div className=''>
      <SystemSideBar />
      <div className='flex flex-wrap justify-center mt-20 '>
        <BigStar systemStar={playerSystem.systemStar} />
        {playerSystem.systemPlanets.map((planet) => {
          return (
            <>
              <div className={'planet-wrapper  '}>
                
                <Link
                  to={`/${sector.sectorName}/system/${playerSystem.systemName}/planet/${planet.name}`}
                  onClick={() => dispatch(setPlanet(planet))}
                >
                  <PlanetComponent planet={planet} />
                </Link>
                <p className='text-center'>
                  {planet.name}
                  <br />
                  {planet.ownership}{' '}
                </p>{' '}
              </div>
            </>
          );
        })}
       
      </div>
    </div>
  );
};
