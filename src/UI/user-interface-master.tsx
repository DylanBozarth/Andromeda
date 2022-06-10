import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { decrement, increment } from '../redux/testSlice';
import styles from '../styles/user-interface-master.module.css';

export const UImaster: React.FC = () => {
  const dispatch = useAppDispatch();
  const testCount = useAppSelector((state) => state.test.testCount);

  return (
    <div>
      <div className={styles.menu}>
        <nav>
          <ul>
            <li>
              <a href='#'>
                <Link to='/' className={styles['ui-main-link']}>
                  Galatic View
                </Link>
              </a>
            </li>
            <li>
              <a href='#'>
                <Link to='/sectora' className={styles['ui-main-link']}>
                  SECTOR-A
                </Link>
              </a>
            </li>

            <li>
              <a href='#'>menu</a>
            </li>

            <li>
              <a href='#'>dropdown</a>
              <ul className={styles.sub1}>
                <li>
                  <a href='#' onClick={() => dispatch(increment())}>
                    Increment
                  </a>
                </li>
                <li>
                  <a href='#' onClick={() => dispatch(decrement())}>
                    Decrement
                  </a>
                </li>
                <li>
                  <a href='#'>{testCount}</a>
                </li>
                <li>
                  <a href='#'>menu</a>
                  <ul className={styles.sub2}>
                    <li>
                      <a href='#'>menu</a>
                    </li>
                    <li>
                      <a href='#'>menu</a>
                    </li>
                    <li>
                      <a href='#'>menu</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
