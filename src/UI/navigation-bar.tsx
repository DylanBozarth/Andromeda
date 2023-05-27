import '../styles/user-interface-master.scss';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
export const NavigationBar = () => {
  const [userSector, setUserSector] = useState('');
  const [userSystem, setUserSystem] = useState('');
  const [userPlanet, setUserPlanet] = useState('');
  const location = useLocation();
  useEffect(() => {
    const currentLocation = location.pathname
    const splitLocation = currentLocation.split('/');
    /* this system is dependent on the url and not state or anything fancy, if you change the url this will break */
    if (currentLocation.includes('sector')) {
      userSector === '' ? setUserSector(splitLocation[1]) : ''
    }
    if (/\d/.test(currentLocation)) {
        setUserSystem(splitLocation[2])
    }
    if (currentLocation.includes('system') /* && !currentLocation.includes('planet') */ ) {
      setUserSystem(splitLocation[3])
    }
    if (currentLocation.includes('planet')) {
      setUserPlanet(splitLocation[5])
    }
  }, [location]);
  const clearEverything = () => {
    setUserSector('')
    setUserSystem('')
    setUserPlanet('')
  }
  return (
    <div className='navigation-bar flex-auto mb-20 sci-fi-thing absolute'>
      <div className='flex justify-content-center'>
        <Link to='/' className=''>
          <div className='ui-border-box'>
            <div className='navigation-bar-text' onClick={() => clearEverything()}>Andromeda</div>
          </div>
        </Link>
      </div>
      <div className='flex justify-content-center'>
        { /* Sector */}
        <Link to={`/${userSector}`} className='navigation-bar-text' onClick={() => setUserSystem('')}>
          <div
            className={
              userSector
                ? 'ui-border-box'
                : ''
            }
            onClick={() => setUserSystem('')}
          >
            <div className='navigation-bar-text'>{userSector}</div>
          </div>
        </Link>
        { /* System */}
        <Link to={`/${userSector}/system/${userSystem}`}>
          <div
            className={
              userSystem
                ? 'ui-border-box'
                : ''
            }
          >
            <div className='navigation-bar-text' onClick={() => setUserPlanet('')}>{userSystem}</div>
          </div>
        </Link>
        { /* planet */}
        <div
          className={
            userPlanet
              ? 'ui-border-box'
              : ''
          }
        >
          <div className='navigation-bar-text'>{userPlanet}</div>
        </div>
      </div>
    </div>
  );
};
