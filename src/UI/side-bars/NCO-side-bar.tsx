import { FleetFloatMenu } from '../float-menus/fleets';
import { useGame } from '../../context/GameContext';

export const NCOSideBar = () => {
  const { activeNCO } = useGame();

  if (!activeNCO) return null;

  return (
    <div className='middle-layer-menu'>
      <div className='side-bar-background'></div>
      <div className='side-bar p-1 ui-white-box p-2'>
        <h3 className='text-center'>{activeNCO.type}</h3>
        <p className='text-center'>{activeNCO.effect} on all fleets in system</p>
        <FleetFloatMenu />
      </div>
    </div>
  );
};
