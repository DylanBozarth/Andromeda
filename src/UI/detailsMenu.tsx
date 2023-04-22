import '../styles/user-interface-master.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
{/* CURRENTLY A LEGACY COMPONENT 5/22/23 */}
export const DetailsMenu = () => {
  const [openMenu, setOpenMenu] = useState<string>('systems');
  return (
    <div className='details-menu-wrapper container-fluid'>
      <div className='nav-container'>
        <div className='details-bar-wrapper'>
          <div className=''>
            <div className='ui-border-box' onClick={() => setOpenMenu('systems')}>
              System Management{' '}
            </div>
          </div>
          <div className=''>
            <button className='ui-border-box' onClick={() => setOpenMenu('fleets')}>
              Fleets
            </button>
          </div>
          <div className=''>
            <button className='ui-border-box' onClick={() => setOpenMenu('research')}>
              research
            </button>
          </div>
          <div className=''>
            <button className='ui-border-box' onClick={() => setOpenMenu('factions')}>
              Factions
            </button>
          </div>
          <div className=''>
            <button className='ui-border-box' onClick={() => setOpenMenu('exploration')}>
              Exploration
            </button>
          </div>
          <div className=''>
            <div className='ui-border-box' onClick={() => setOpenMenu('ship-designer')}>
              Ship designer
            </div>
          </div>
        </div>
        <Link to='/' className='go-back'>
          Go back 
        </Link>
      </div>
      <div>
        
      </div>
    </div>
  );
};
