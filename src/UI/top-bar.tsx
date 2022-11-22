import styles from '../styles/user-interface-master.module.css';
import { useState } from 'react';
import { Alerts} from './menu-pages/pop-ups/alerts';
import { ResourceMenu } from './menu-pages/pop-ups/resources';
import { Link } from 'react-router-dom';
export const TopBar = () => {
  const [openMenu, setOpenMenu] = useState(0);
  return (
    <div>
      <div className={styles['sci-fi-thing']}></div>
      <div className={styles['top-bar-wrapper']}>
        <Link to='menu'>
          <button className={styles['top-nav-1']} onClick={() => setOpenMenu(0)}>Big menu</button> {/* leads to destailsMenu.tsx */}
        </Link>
        <div className={styles['top-nav-button-base']}>
          <button
            className={styles['top-nav-1']}
            onClick={() => (openMenu === 1 ? setOpenMenu(0) : setOpenMenu(1))} 
          >
            Main menu
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
      <div className={openMenu === 1 ? 'take-whole-screen' : 'hidden'}>
         main menu will go here
      </div>
      <div className={openMenu === 2 ? 'take-whole-screen' : 'hidden'}>
        <Alerts />
      </div>
      <div className={openMenu === 3 ? 'take-whole-screen' : 'hidden'}>
        <ResourceMenu />
      </div>
    </div>
  );
};
