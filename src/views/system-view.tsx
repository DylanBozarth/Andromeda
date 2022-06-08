import { useEffect } from 'react';
import { PlanetComponent } from '../components/planet';
import styles from '../styles/views-styles/system-view.module.css';
import { PlayerSystem, Sector } from '../types/system-interfaces';

interface PlayerSystemProps {
  playerSystem: PlayerSystem;
  setPlayerSystem: any;
}

export const SystemView = ({ playerSystem, setPlayerSystem }: PlayerSystemProps) => {
  const playerSystemArray: Sector[] = Object.values(playerSystem);
  const systemPlanetArray = playerSystemArray[0].systemPlanets;

  useEffect(() => {
    console.log(systemPlanetArray);
  }, [systemPlanetArray]);

  return (
    <div className={`${styles['playerSystemArray-view-wrapper']} row`}>
      {playerSystemArray.map(({ id, systemName, systemStar }) => {
        return (
          <div key={id}>
            {systemName}, {systemStar} system.
          </div>
        );
      })}
      {systemPlanetArray.map((planet) => {
        return (
          <div key={planet} className={`col-sm-2 ${styles['planet-wrapper']}`}>
            <PlanetComponent planet={planet} />
          </div>
        );
      })}
    </div>
  );
};
