import { PlanetComponent } from '../components/planet';
import styles from '../styles/views-styles/system-view.module.css';
import { SystemBottomBar } from '../UI/system-bottom-bar';
import { System } from '../utils/system-generator/generate-sector';

interface PlayerSystemProps {
  playerSystem: System;
}

export const SystemView = ({ playerSystem }: PlayerSystemProps) => {
  return (
    <div className={`${styles['playerSystemArray-view-wrapper']} row`}>
      
      {playerSystem.systemPlanets.map((planet) => {
        return (
          <>
            <div className={`col-sm-2 ${styles['planet-wrapper']}`}>
              <PlanetComponent planet={planet} />
            </div>
            {[
              planet.resources.map((resource, idx) => {
                return <p className="hidden"  key={`${planet}-${resource}-${idx}`}>{resource}</p>;
              }),
            ]}
            {[
              planet.buildings.map((building, idx) => {
                return <p className="hidden" key={`${planet}-${building}-${idx}`}>{building}</p>;
              }),
            ]}
            
          </>
        );
      })}
      <div key={playerSystem.systemName} className="text-center">
      </div>
      <SystemBottomBar playerSystem={playerSystem}  />
    </div>
  );
};
