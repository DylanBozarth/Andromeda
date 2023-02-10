import '../styles/user-interface-master.module.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { playerRawResources } from '../player-data/raw-resources'
import { playerRefinedResources } from '../player-data/refined-resources';
export const TopBar = () => {
  const [openMenu, setOpenMenu] = useState(0);
  return (
    <div>
      <div className='sci-fi-thing'></div>
      <div className='top-bar-wrapper'>
        <h3 className='mt-3 m-1'>Fuel {playerRefinedResources.fuel} </h3>
        <Link to='menu'>
          <button className='top-nav-1' onClick={() => setOpenMenu(0)}>
            Details Menus {/* leads to destailsMenu.tsx */}
          </button>{' '}
        </Link>
        <h3 className='mt-3 m-1'>Water: {playerRawResources.water}</h3>
      </div>
    </div>
  );
};
