import styles from '../styles/user-interface-master.module.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export const TopBar = () => {
  const [openMenu, setOpenMenu] = useState(0);
  return (
    <div>
      <div className={styles['sci-fi-thing']}></div>
      <div className={styles['top-bar-wrapper']}>
        <Link to='menu'>
          <button className={styles['top-nav-1']} onClick={() => setOpenMenu(0)}>
            Details Menus {/* leads to destailsMenu.tsx */}
          </button>{' '}
        </Link>
      </div>
    </div>
  );
};
