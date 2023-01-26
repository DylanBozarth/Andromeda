import styles from '../../styles/user-interface-master.module.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SystemDetails } from './stats-pages/systems';
import { FleetDetails } from './stats-pages/fleets';
import { ResearchDetails } from './stats-pages/research';
import { EspionageDetails } from './stats-pages/espionage';
import { ShipDesigner } from './stats-pages/ship-designer';
import { ExploreDetails } from './stats-pages/exploration';
export const DetailsMenu = () => {
  const [openMenu, setOpenMenu] = useState<string>('systems')
  return (
    <div className={styles['details-menu-wrapper']}>
      <div className={styles['nav-container']}>
        <h2>Heading</h2>
        <div className={styles['details-bar-wrapper']}>
          <div className={styles['details-nav-button-base']}>
            <div className={styles['details-nav-1']} onClick={() => setOpenMenu('systems')}>System Management </div>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']} onClick={() => setOpenMenu('fleets')}>Fleets</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']} onClick={() => setOpenMenu('research')}>research</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']} onClick={() => setOpenMenu('espionage')}>Espionage</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']} onClick={() => setOpenMenu('exploration')}>Exploration</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <div className={styles['details-nav-1']} onClick={() => setOpenMenu('ship-designer')}>Ship designer</div>
          </div>
        </div>
        <Link to='/' className={styles['go-back']}>Go back aaaaa</Link>
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
