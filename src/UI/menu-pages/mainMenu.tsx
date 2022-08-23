import styles from '../../styles/user-interface-master.module.css';
import { Link } from 'react-router-dom';
export const MainMenu = () => {
  return (
    <div className={styles['details-menu-wrapper']}>
      <Link to='/' className={styles['go-back']}>Go back </Link>
      <div className={styles['nav-container']}>
        <h2>Heading</h2>
        <div className={styles['details-bar-wrapper']}>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']}>Tab1</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']}>Tab 2</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']}>Tab 3</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']}>Tab 4</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']}>Tab 5</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']}>Tab 6</button>
          </div>
          <div className={styles['details-nav-button-base']}>
            <button className={styles['details-nav-1']}>Tab 7</button>
          </div>
        </div>
      </div>
    </div>
  );
};
