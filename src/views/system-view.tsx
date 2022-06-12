import { useEffect } from 'react';
import { PlanetComponent } from '../components/planet';
import styles from '../styles/views-styles/system-view.module.css';
import { PlayerSystem, Sector } from '../types/system-interfaces';

interface PlayerSystemProps {
  playerSystem: PlayerSystem;
  setPlayerSystem: any;
}

export const SystemView = ({ playerSystem, setPlayerSystem }: PlayerSystemProps) => {
  const { sector } = playerSystem;
  return (
    <div className={`${styles['playerSystemArray-view-wrapper']} row`}>
      <div key={sector.systemName}>
        {sector.systemName}, {sector.systemStar} system.
      </div>
      {Object.keys(playerSystem.sector.systemPlanets).map((planet) => {
        return (
          <>
            <div className={`col-sm-2 ${styles['planet-wrapper']}`}>
              <PlanetComponent planet={planet} />
            </div>
            {[
              playerSystem.sector.systemPlanets[planet].map((resource, idx) => {
                return <p key={`${planet}-${resource}-${idx}`}>{resource}</p>;
              }),
            ]}
          </>
        );
      })}
    </div>
  );
};
