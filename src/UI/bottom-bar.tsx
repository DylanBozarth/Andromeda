import styles from '../styles/user-interface-master.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'

export const BottomBar = () => {
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
    <div className={styles['bottom-bar']}>
      <div className={styles['bottom-bar-section']}><Link to='/' onClick={() => setUserSector('')} className={styles['bottom-bar-text']}>Galaxy</Link></div>
      <div className={userSector ? styles['bottom-bar-section'] : styles['bottom-bar-section-inactive']} onClick={() => setUserSystem('')}>
        <Link to={`/${userSector}`} className={styles['bottom-bar-text']}>{userSector}</Link>
      </div>
      <div className={userSystem ? styles['bottom-bar-section'] : styles['bottom-bar-section-inactive']}>
        <p className={styles['bottom-bar-text']}>{userSystem}</p>
        </div>

    </div>
  )
  }