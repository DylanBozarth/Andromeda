import '../../styles/textures/planets-and-stars.scss';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { BigPlanetComponent } from '../../components/bigplanet';
import { PlanetSideBar } from '../../UI/side-bars/planet-side-bar';

export const PlanetView = () => {
  const playerPlanetArray = useAppSelector((state) => [state.sector.activeSystem.activePlanet]);
  const playerPlanet = useAppSelector((state) => state.sector.activeSystem.activePlanet);
  useEffect(() => {
    console.log(playerPlanet)
  }, [])
  return (
    <div className=''>
      {playerPlanetArray.map((planet) => {
        return (
          <div key="planet-view" className='flex'>
            <div className={'planet-wrapper'}>
              <PlanetSideBar
                playerPlanet={playerPlanet} />
              <BigPlanetComponent planet={planet} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
