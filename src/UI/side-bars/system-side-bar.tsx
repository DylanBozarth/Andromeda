import '@styles/user-interface-master.scss';
import { FleetFloatMenu } from '../float-menus/fleets';
import { useGame } from '../../context/GameContext';

export const SystemSideBar = () => {
  const { activeSystem } = useGame();

  if (!activeSystem) return null;

  return (
    <div className='middle-layer-menu'>
      <div className='side-bar-background'></div>
      <div className='side-bar p-1 ui-white-box p-2'>
        <h3 className='text-center'>{activeSystem.systemName}</h3>
        <h5 className='text-center'>{activeSystem.systemStar} star</h5>
        <p className='text-center'>{activeSystem.systemPlanets.length} Planets</p>
        <FleetFloatMenu />
      </div>
    </div>
  );
};
