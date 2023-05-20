import '../styles/textures/planets-and-stars.scss';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { PlanetSideBar } from '../UI/planet-side-bar';
import { BigPlanetComponent } from '../components/bigplanet';

export const PlanetView = () => {
    const playerPlanetArray = useAppSelector((state) => [state.sector.activeSystem.activePlanet]);
    const playerPlanet = useAppSelector((state) => state.sector.activeSystem.activePlanet);
    const [toggleResources, setToggleResources] = useState(false);
    const [toggleBuildings, setToggleBuildings] = useState(false);
    useEffect(() => {
        console.log(playerPlanet)
    }, [])
    return (
        <div className={'playerSystemArray-view-wrapper row'}>
          {playerPlanetArray.map((planet) => {
            return (
              <>
                <div className={'planet-wrapper'}>
                <PlanetSideBar 
                    playerPlanet={playerPlanet} 
                    toggleResources={toggleResources}
                    toggleBuildings={toggleBuildings}
                    setToggleResources={setToggleResources}
                    setToggleBuildings={setToggleBuildings} />
                  <BigPlanetComponent planet={planet} />
                </div>
                {[
                  planet.naturalResources.map((resource, idx) => {
                    return (
                      <div
                        className={toggleResources ? 'planet-resources' : 'hidden'}
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
                        className={toggleBuildings ? 'planet-buildings ' : 'hidden'}
                        key={`${planet}-${building}-${idx}`}
                      >
                        {building} 
                        
                      </div>
                    );
                  }),
                ]} 
              </>
            );
          })}        
          </div>
      );
    };
    