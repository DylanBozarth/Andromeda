import '../styles/textures/planets-and-stars.scss';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { BigPlanetComponent } from '../components/bigplanet';
import { PlanetSideBar } from '../UI/side-bars/planet-side-bar';

export const PlanetView = () => {
  const playerPlanetArray = useAppSelector((state) => [state.sector.activeSystem.activePlanet]);
  const playerPlanet = useAppSelector((state) => state.sector.activeSystem.activePlanet);
  const [toggleResources, setToggleResources] = useState(false);
  const [toggleBuildings, setToggleBuildings] = useState(false);
  useEffect(() => {
    console.log(playerPlanet)
  }, [])
  return (
    <div className={'playerSystemArray-view-wrapper '}>
      {playerPlanetArray.map((planet) => {
        return (
          <div key="planet-view" className='flex'>
            <div className={'planet-wrapper'}>
              <PlanetSideBar
                playerPlanet={playerPlanet}
                toggleResources={toggleResources}
                toggleBuildings={toggleBuildings}
                setToggleResources={setToggleResources}
                setToggleBuildings={setToggleBuildings} />
              <BigPlanetComponent planet={planet} />
            </div>
            <div className=''>
              {[
                planet.naturalResources.map((resource, idx) => {
                  return (
                    <div
                      className={toggleResources ? 'planet-resources mt-10 border-1 p-10 ' : 'hidden'}
                      key={`${planet}-${resource}-${idx}`}
                    >
                      <div className=''>{resource}</div>
                    </div>
                  );
                }),
              ]}

              {[
                planet.buildings.map((building, idx) => {
                  return (
                    <div
                      className={toggleBuildings ? 'planet-buildings mt-5' : 'hidden'}
                      key={`${planet}-${building}-${idx}`}
                    >
                      {building}

                    </div>
                  );
                }),
              ]}
            </div>
          </div>
        );
      })}
    </div>
  );
};
