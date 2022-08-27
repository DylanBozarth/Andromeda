import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import styles from '../styles/views-styles/galatic-view.module.css';

export const GalaticView = () => {
  const sectors = useAppSelector((state) => state.sector);
  console.log({ sectors });
  return (
    <div>
      <img src='./assets/Galaxy.jpg' className={styles['galaxy']} alt='galaxy' />
      <div className={styles['sectorawrapper']}>
        <img src='./assets/sample-image.png'></img>
        <Link to='/redux-sector' className={styles['sectora']}>
          {' '}
          SECTOR A
        </Link>
      </div>
    </div>
  );
};
