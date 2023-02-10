import '../styles/user-interface-master.module.scss';
import { System } from '../utils/system-generator/generate-sector';
import { useState } from 'react';
import { SystemPowerBar } from './system-power-bar';
interface systemInformation {
  playerSystem: System;
}
interface toggles {
  toggleResources: boolean;
  toggleBuildings: boolean;
  setToggleResources: (flag: boolean) => void;
  setToggleBuildings: (flag: boolean) => void;
}
export const SystemSideBar = ({
  playerSystem,
  toggleBuildings,
  toggleResources,
  setToggleBuildings,
  setToggleResources,
}: systemInformation & toggles) => {
  const [expanded, setExpanded] = useState(true);
  const [tabNumber, setTabNumber] = useState(1);
  return (
    <div className='side-bar-wrapper'>
      <div
        onClick={() => setExpanded(!expanded)}
        className='ui-border-box toggle-side-bar'
      >
        Toggle UI
      </div>
      <div className={expanded ? 'side-bar' : 'hidden'}>
        <div className='side-bar-background-wrapper'>
          <div className='side-bar-background'></div>
        </div>
        <div className='side-tab-row'>
          <div className='side-tab' onClick={() => setTabNumber(1)}>
            Buildings
          </div>
          <div className='side-tab' onClick={() => setTabNumber(2)}>
            Hangar
          </div>
          <div className='side-tab' onClick={() => setTabNumber(3)}>
            Alerts
          </div>
        </div>
        <div className='side-screen'>
          <div className={tabNumber === 1 ? 'side-tab-info' : 'hidden'}>
            A building is building on planet X
          </div>
          <div className={tabNumber === 2 ? 'side-tab-info' : 'hidden'}>
            Production
          </div>
          <div className={tabNumber === 3 ? 'side-tab-info' : 'hidden'}>Alerts</div>
        </div>
        <SystemPowerBar
          playerSystem={playerSystem}
          toggleResources={toggleResources}
          toggleBuildings={toggleBuildings}
          setToggleResources={setToggleResources}
          setToggleBuildings={setToggleBuildings}
        />
      </div>
    </div>
  );
};
