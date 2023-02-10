import '../styles/user-interface-master.module.scss';
import { System } from '../utils/system-generator/generate-sector';
import { getSystemPower } from '../utils/system-generator/system-power';
interface systemInformation {
  playerSystem: System;
}
interface toggles {
  toggleResources: boolean;
  toggleBuildings: boolean;
  setToggleResources: (flag: boolean) => void;
  setToggleBuildings: (flag: boolean) => void;
}
export const SystemPowerBar = ({
  playerSystem,
  toggleBuildings,
  toggleResources,
  setToggleBuildings,
  setToggleResources,
}: systemInformation & toggles) => {
  const { shipPower, buildingPower } = getSystemPower(playerSystem);
  return (
    <div className='system-power-bar-wrapper'>
      <div className='system-power-bar'>
        <div className='power-bar-section'>
          System Power
          <br /> Hangar {shipPower}
          <br /> Planetary defenses {buildingPower}
        </div>
        <button
          className='system-power-toggle-button'
          onClick={() => setToggleResources(!toggleResources)}
        >
          resources
        </button>
        <button
          className='system-power-toggle-button'
          onClick={() => setToggleBuildings(!toggleBuildings)}
        >
          buildings
        </button>
      </div>
    </div>
  );
};
