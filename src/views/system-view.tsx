import { PlanetComponent } from '../components/planet';
import { useState } from 'react';
import styles from '../styles/views-styles/system-view.module.css';
import { SystemSideBar } from '../UI/system-side-bar';
import { System } from '../utils/system-generator/generate-sector';

interface PlayerSystemProps {
  playerSystem: System;
}

export const SystemView = ({ playerSystem }: PlayerSystemProps) => {
  const [toggleResources, setToggleResources] = useState(false);
  const [toggleBuildings, setToggleBuildings] = useState(false);
  return (
    <div className={`${styles['playerSystemArray-view-wrapper']} row`}>
      <SystemSideBar playerSystem={playerSystem} toggleResources={toggleResources} toggleBuildings={toggleBuildings} setToggleResources={setToggleResources} setToggleBuildings={setToggleBuildings} />
      {playerSystem.systemPlanets.map((planet) => {
        return (
          <>
            <div className={`col-sm-2 ${styles['planet-wrapper']}`}>
              <PlanetComponent planet={planet} />
            </div>
            {[
              planet.resources.map((resource, idx) => {
                return <div className={toggleResources ? 'planet-resources' : 'hidden'} key={`${planet}-${resource}-${idx}`}>{resource}</div>;
              }),
            ]}

            {[
              planet.buildings.map((building, idx) => {
                return <div className={toggleBuildings ? 'planet-buildings' : 'hidden'} key={`${planet}-${building}-${idx}`}>{building}</div>;
              }),
            ]}

          </>
        );
      })}
    </div>
  );
};
