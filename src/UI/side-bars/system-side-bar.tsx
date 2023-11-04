import '../../styles/user-interface-master.scss';
import { FleetFloatMenu } from '../float-menus/fleets';
import { useAppSelector } from '../../redux/hooks';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export const SystemSideBar = () => {
  const [viewCheck, setViewCheck] = useState(true)
  const playerSystem = useAppSelector((state) => state.sector.activeSystem);
  const viewChecker = () => {
    if (window.location.href.includes('orbital')) {
      return 'Planet View'
    }
    else {
      return 'Orbital View'
    }

  }
  return (
    <div className='middle-layer-menu'>
      <div className='side-bar-background'></div>

      <div className='side-bar p-1  ui-white-box p-2'>
        <Link to={viewCheck ? window.location.href + '/orbital' : window.location.href.replace('/orbital', '')} className='p-3 border-1' onClick={() => setViewCheck(!viewCheck)}>{viewChecker()}</Link>
        <h3 className='text-center'>{playerSystem.systemName}</h3>
        <h5 className='text-center'>{playerSystem.systemStar} star</h5>
        <p className='text-center'>{playerSystem.systemPlanets.length} Planets</p>

      </div>

    </div>
  );
};