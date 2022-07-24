import { Link } from 'react-router-dom';
import styles from '../styles/views-styles/galatic-view.module.css';

export const GalaticView = () => {
  return (
    <div>
      <img src='./assets/Galaxy.jpg' className={styles['galaxy']} alt='galaxy' />
      <div className={styles['sectorawrapper']}><img src='./assets/sample-image.png'></img><Link to='/redux-sector' className={styles['sectora']}> SECTOR A</Link>
      </div>
    </div>
  );
};
