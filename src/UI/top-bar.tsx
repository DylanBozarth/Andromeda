import styles from '../styles/user-interface-master.module.css';
import { useState } from 'react';
import { Research } from './menu-pages/pop-ups/research';
import { ResourceMenu } from './menu-pages/pop-ups/resources';
import { FleetManagement } from './menu-pages/pop-ups/fleetManagement';
import { Link } from 'react-router-dom';
export const TopBar = () => {
  const [openMenu, setOpenMenu] = useState(0);
  return (
    <div>
      <div className={styles['sci-fi-thing']}></div>
      <div className={styles['top-bar-wrapper']}>
        <Link to='menu'>
          <button className={styles['top-nav-1']}>Big menu</button>
        </Link>
        <div className={styles['top-nav-button-base']}>
          <button
            className={styles['top-nav-1']}
            onClick={() => (openMenu === 1 ? setOpenMenu(0) : setOpenMenu(1))}
          >
            Pop up 1
          </button>
        </div>
        <div className={styles['top-nav-button-base']}>
          <button
            className={styles['top-nav-1']}
            onClick={() => (openMenu === 2 ? setOpenMenu(0) : setOpenMenu(2))}
          >
            Pop up 2
          </button>
        </div>
        <div className={styles['top-nav-button-base']}>
          <button
            className={styles['top-nav-1']}
            onClick={() => (openMenu === 3 ? setOpenMenu(0) : setOpenMenu(3))}
          >
            Pop up 3
          </button>
        </div>
      </div>
      {/* pop up menus */}
      <div className={openMenu === 1 ? 'take-whole-screen' : 'hidden'}>
        <Research />
      </div>
      <div className={openMenu === 2 ? 'take-whole-screen' : 'hidden'}>
        <FleetManagement />
      </div>
      <div className={openMenu === 3 ? 'take-whole-screen' : 'hidden'}>
        <ResourceMenu />
      </div>
    </div>
  );
};
