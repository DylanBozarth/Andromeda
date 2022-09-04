import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setSector } from '../redux/sectorSlice';
import styles from '../styles/views-styles/galatic-view.module.css';

export const GalaticView = () => {
  const dispatch = useAppDispatch();
  const sectors = useAppSelector((state) => state.sector);
  console.log({ sectors });
  return (
    <div>
      <img src='./assets/Galaxy.jpg' className={styles['galaxy']} alt='galaxy' />
      <div className={styles['sectorawrapper']}>
        <img src='./assets/sample-image.png'></img>
        <Link
          to='/redux-sector'
          onClick={() => dispatch(setSector(sectors.activeSector))}
          className={styles['sectora']}
        >
          {' '}
          SECTOR A
        </Link>
      </div>
    </div>
  );
};
