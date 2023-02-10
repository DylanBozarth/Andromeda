import '../../styles/user-interface-master.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SystemDetails } from './details-pages/system-management';
import { FleetDetails } from './details-pages/fleets';
import { ResearchDetails } from './details-pages/research';
import { EspionageDetails } from './details-pages/espionage';
import { ShipDesigner } from './details-pages/ship-designer';
import { ExploreDetails } from './details-pages/exploration';
export const DetailsMenu = () => {
  const [openMenu, setOpenMenu] = useState<string>('systems');
  return (
    <div className='details-menu-wrapper'>
      <div className='nav-container'>
        <div className='details-bar-wrapper'>
          <div className='details-nav-button-base'>
            <div className='ui-border-box' onClick={() => setOpenMenu('systems')}>
              System Management{' '}
            </div>
          </div>
          <div className='details-nav-button-base'>
            <button className='ui-border-box' onClick={() => setOpenMenu('fleets')}>
              Fleets
            </button>
          </div>
          <div className='details-nav-button-base'>
            <button className='ui-border-box' onClick={() => setOpenMenu('research')}>
              research
            </button>
          </div>
          <div className='details-nav-button-base'>
            <button className='ui-border-box' onClick={() => setOpenMenu('espionage')}>
              Espionage
            </button>
          </div>
          <div className='details-nav-button-base'>
            <button className='ui-border-box' onClick={() => setOpenMenu('exploration')}>
              Exploration
            </button>
          </div>
          <div className='details-nav-button-base'>
            <div className='ui-border-box' onClick={() => setOpenMenu('ship-designer')}>
              Ship designer
            </div>
          </div>
        </div>
        <Link to='/' className='go-back'>
          Go back aaaaa
        </Link>
      </div>
      <div>
        {/* All of these should be in the details-pages folder */}
        <div className={openMenu === 'systems' ? 'take-whole-screen' : 'hidden'}>
          <SystemDetails />
        </div>
        <div className={openMenu === 'fleets' ? 'take-whole-screen' : 'hidden'}>
          <FleetDetails />
        </div>
        <div className={openMenu === 'research' ? 'take-whole-screen' : 'hidden'}>
          <ResearchDetails />
        </div>
        <div className={openMenu === 'espionage' ? 'take-whole-screen' : 'hidden'}>
          <EspionageDetails />
        </div>
        <div className={openMenu === 'exploration' ? 'take-whole-screen' : 'hidden'}>
          <ExploreDetails />
        </div>
        <div className={openMenu === 'ship-designer' ? 'take-whole-screen' : 'hidden'}>
          <ShipDesigner />
        </div>
      </div>
    </div>
  );
};
