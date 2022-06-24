import { Link } from 'react-router-dom';
import styles from '../styles/views-styles/galatic-view.module.css';

export const GalaticView = () => {
  return (
    <div>
      Galaxy placeholder. These will be placed around the galaxy <br />
      <Link to='/redux-sector'>Run Generate before clicking me</Link>
      <img src='./assets/Galaxy.jpg' className={styles.galaxy} alt='galaxy' />
    </div>
  );
};
