import { PlanetComponent } from '../components/planet';
import { useState } from 'react';
import '../styles/views-styles/system-view.css';
import { SystemSideBar } from '../UI/system-side-bar';
import { useAppSelector } from '../redux/hooks';
import { AvailableBuildings } from '../UI/buildings/AvailableBuildings';

export const SystemView = () => {
  const [toggleResources, setToggleResources] = useState(false);
  const [toggleBuildings, setToggleBuildings] = useState(false);
  const playerSystem = useAppSelector((state) => state.sector.activeSystem);
  const addNewBuilding = (planet) => {
    console.log(planet.planet.buildings)
    // I have no idea why I have to do planet.planet, it's an object that's wrapped itself 
  }
  return (
    <div className={'playerSystemArray-view-wrapper row'}>
      <SystemSideBar
        playerSystem={playerSystem}
        toggleResources={toggleResources}
        toggleBuildings={toggleBuildings}
        setToggleResources={setToggleResources}
        setToggleBuildings={setToggleBuildings}
      />
      {playerSystem.systemPlanets.map((planet) => {
        return (
          <>
            <div className={'planet-wrapper'}>
              <PlanetComponent planet={planet} />
            </div>
            {[
              planet.resources.map((resource, idx) => {
                return (
                  <div
                    className={toggleResources ? 'planet-resources' : 'hidden'}
                    key={`${planet}-${resource}-${idx}`}
                  >
                    {resource}
                  </div>
                );
              }),
            ]}

            {[
              planet.buildings.map((building, idx) => {
                return (
                  <div
                    className={toggleBuildings ? 'planet-buildings' : 'hidden'}
                    key={`${planet}-${building}-${idx}`}
                  >
                    {building} 
                    
                  </div>
                );
              }),
            ]} <div className={toggleBuildings ? '' : 'hidden'}><AvailableBuildings /></div>
          </>
        );
      })}
    </div>
  );
};
