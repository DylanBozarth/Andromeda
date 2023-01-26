import styles from '../styles/user-interface-master.module.scss';
import { useState } from 'react';
import { Alerts } from './menu-pages/pop-ups/alerts';
import { ResourceMenu } from './menu-pages/pop-ups/resources';
import { Link } from 'react-router-dom';
export const TopBar = () => {
  const [openMenu, setOpenMenu] = useState(0);
  return (
    <div>
      <div className={styles['sci-fi-thing']}></div>
      <div className={styles['top-bar-wrapper']}>
        <Link to='menu'>
          <button className={styles['top-nav-1']} onClick={() => setOpenMenu(0)}>
            Details Menus
          </button>{' '}
          {/* leads to destailsMenu.tsx */}
        </Link>
        <div className={styles['top-nav-button-base']}>
          {/* Below are the 'pop-up menus' */}
          <button
            className={styles['top-nav-1']}
            onClick={() => (openMenu === 1 ? setOpenMenu(0) : setOpenMenu(1))}
          >
            Main menu {/* Log in, log out, etc */}
          </button>
        </div>
        <div className={styles['top-nav-button-base']}>
          <button
            className={styles['top-nav-1']}
            onClick={() => (openMenu === 2 ? setOpenMenu(0) : setOpenMenu(2))}
          >
            Alerts
          </button>
        </div>
        <div className={styles['top-nav-button-base']}>
          <button
            className={styles['top-nav-1']}
            onClick={() => (openMenu === 3 ? setOpenMenu(0) : setOpenMenu(3))}
          >
            Resources
          </button>
        </div>
      </div>
      {/* pop up menus */}
      <div className={openMenu === 1 ? 'pop-up' : 'hidden'}>main menu will go here</div>
      <div className={openMenu === 2 ? 'pop-up' : 'hidden'}>
        <Alerts />
      </div>
      <div className={openMenu === 3 ? 'pop-up' : 'hidden'}>
        <ResourceMenu />
      </div>
    </div>
  );
};
