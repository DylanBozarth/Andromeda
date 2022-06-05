import { useEffect } from 'react';
import { PlanetComponent } from '../components/planet';
import '../styles/views-styles/system-view.css';
interface PlayerSystemProps {
  playerSystem: any;
  setPlayerSystem: any;
}

export const SystemView = ({ playerSystem, setPlayerSystem }: PlayerSystemProps) => {
  const playerSystemArray: any = Object.values(playerSystem);
  const systemPlanetArray = playerSystemArray[0].systemPlanets;
  useEffect(() => {
    console.log(systemPlanetArray);
  }, []);
  return (
    <div className='playerSystemArray-view-wrapper row'>
      {playerSystemArray.map(({ systemName, systemStar }) => {
        return (
          <div key={systemName}>
            {systemName}, {systemStar} system.
          </div>
        );
      })}
      {systemPlanetArray.map((planet) => {
        return (
          <div key={planet} className='col-sm-2 planet-wrapper'>
            <PlanetComponent planet={planet} />
          </div>
        );
      })}
    </div>
  );
};
