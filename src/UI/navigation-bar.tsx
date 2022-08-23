import styles from '../styles/user-interface-master.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'

export const NavigationBar = () => {
  const [userSector, setUserSector] = useState('');
  const [userSystem, setUserSystem] = useState('');
  const location = useLocation();
  useEffect(() => {
    if (window.location.href.includes('system')) {
      const locationURL = (window.location.href.split('/'))
      setUserSystem(locationURL[locationURL.length - 1])
    }
    else if (window.location.href.includes('sector')) {
      const locationURL2 = (window.location.href.split('/'))
      setUserSector(locationURL2[locationURL2.length - 1])
    }
    else {
      setUserSector('');
      setUserSystem('')
    }
  }, [location])
  return (
    <div className={styles['navigation-bar']}>
      <Link to='/' onClick={() => setUserSector('')} className={styles['navigation-bar-text']}>
          <div className={`${styles['navigation-bar-section']} ${styles['ui-border-box']}`}><div className={styles['navigation-bar-text']}>Andromeda</div></div>
      </Link>
      <Link to={`/${userSector}`} className={styles['navigation-bar-text']}>
        <div className={userSector ? `${styles['navigation-bar-section']} ${styles['ui-border-box']}` : styles['navigation-bar-section-inactive']} onClick={() => setUserSystem('')}>
        <div className={styles['navigation-bar-text']}>{userSector}</div>
      </div>
      </Link>
      <div className={userSystem ? `${styles['navigation-bar-section']} ${styles['ui-border-box']}` : styles['navigation-bar-section-inactive']}>
        <div className={styles['navigation-bar-text']}>{userSystem}</div>
      </div>
    </div>
  )
}