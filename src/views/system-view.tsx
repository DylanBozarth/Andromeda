import { PlanetComponent } from '../components/planet';
import styles from '../styles/views-styles/system-view.module.css';
import { System } from '../utils/system-generator/generate-sector';

interface PlayerSystemProps {
  playerSystem: System;
}

export const SystemView = ({ playerSystem }: PlayerSystemProps) => {
  return (
    <div className={`${styles['playerSystemArray-view-wrapper']} row`}>
      <div key={playerSystem.systemName}>
        {playerSystem.systemName}, {playerSystem.systemStar} system.
      </div>
      {playerSystem.systemPlanets.map((planet) => {
        return (
          <>
            <div className={`col-sm-2 ${styles['planet-wrapper']}`}>
              <PlanetComponent planet={planet} />
            </div>
            {[
              planet.resources.map((resource, idx) => {
                return <p key={`${planet}-${resource}-${idx}`}>{resource}</p>;
              }),
            ]}
            <div>
              Buildings
            </div>
            {[
              planet.buildings.map((building, idx) => {
                return <p key={`${planet}-${building}-${idx}`}>{building}</p>;
              }),
            ]}
            
          </>
        );
      })}
    </div>
  );
};
