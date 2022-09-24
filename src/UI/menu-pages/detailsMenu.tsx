import styles from '../../styles/user-interface-master.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SystemDetails } from './stats-pages/systems';
import { FleetDetails } from './stats-pages/fleets';
import { ResearchDetails } from './stats-pages/research';
import { PoliticsDetails } from './stats-pages/politics';
export const DetailsMenu = () => {
  const [openMenu, setOpenMenu] = useState<string>('systems')
  return (
    <div className={styles['details-menu-wrapper']}>
      <Link to='/' className={styles['go-back']}>Go back </Link>
      <div className={styles['nav-container']}>
        <h2>Heading</h2>
        <div className={styles['details-bar-wrapper']}>
          <div className={styles['details-nav-button-base']}>
            <div className={styles['details-nav-1']} onClick={() => setOpenMenu('systems')}>Systems</div>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']} onClick={() => setOpenMenu('fleets')}>Fleets</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']} onClick={() => setOpenMenu('research')}>research</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']}  onClick={() => setOpenMenu('politics')}>politics</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']}>fifve</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']}>666</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <div  className={styles['details-nav-1']}>smegma</div>
          </div>
        </div>
      </div>
      <div>
      <div className={openMenu === 'systems' ? 'take-whole-screen' : 'hidden'}>
        <SystemDetails />
      </div>
      <div className={openMenu === 'fleets' ? 'take-whole-screen' : 'hidden'}>
        <FleetDetails />
      </div>
      <div className={openMenu === 'research' ? 'take-whole-screen' : 'hidden'}>
        <ResearchDetails />
      </div>
      <div className={openMenu === 'politics' ? 'take-whole-screen' : 'hidden'}>
        <PoliticsDetails />
      </div>
      </div>
    </div>
  );
};