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
    const getTheLocationString = (searchFor) => {
          const index = currentLocation.indexOf(`${searchFor}`) + 1;
          const nextIndex = index.toString().indexOf('/', index);
          const result = currentLocation.substring(index - nextIndex);
          console.log(result)
          return result.toString();
    }
    if (currentLocation.includes('sector')) {
      userSector === '' ? setUserSector(getTheLocationString('/sector')) : ''
      if (/\d/.test(currentLocation)) {
        setUserSystem(getTheLocationString(''))
      }
      if (currentLocation.includes('system')) {
        userSystem === '' ? setUserSystem(getTheLocationString('/system')) : ''
        if (currentLocation.includes('planet')) {
          userSystem === '' ? setUserPlanet(getTheLocationString('/planet')) : ''
        }
      }
    }
    /* if (/\d/.test(location.pathname)) { // detect NCOs by number, NCOs fill the 'system' slot. 
      const locationURL = location.pathname.split('system');
      setUserSystem(currentLocation.split('system')[currentLocation.length - 1]);
    } */
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
