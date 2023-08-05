import '../styles/user-interface-master.scss';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const NavigationBar = () => {
  const [userSector, setUserSector] = useState('');
  const [userSystem, setUserSystem] = useState('');
  const [userPlanet, setUserPlanet] = useState('');
  const [isNCO, setIsNCO] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const currentLocation = location.pathname
    const splitLocation = currentLocation.split('/');
    // let systemLink = isNCO ? `/${userSector}/system/${userSystem}` : `/${userSector}/${userSystem}` ;
    /* this system is dependent on the url and not state or anything fancy, if you change the url this will break */
    if (currentLocation.includes('sector')) {
      userSector === '' ? setUserSector(splitLocation[1]) : '';
    }
    if (/\d/.test(currentLocation)) { // check for numbers in name for NCO
      setUserSystem(splitLocation[2]);
      setUserPlanet('');
      setIsNCO(true);
    }
    if (currentLocation.includes('system')) {
      setUserSystem(splitLocation[3]);
      setIsNCO(false);
    }
    if (currentLocation.includes('planet')) {
      setUserPlanet(splitLocation[5]);
    }
  }, [location]);
  const clearEverything = () => {
    setUserSector('')
    setUserSystem('')
    setUserPlanet('')
  }
  const clearPlanetAndSystem = () => {
    setUserSystem('');
    setUserPlanet('')
  }
  return (
    <div className='top-layer-menu top-0 fixed  sci-fi-thing '>
      <div className='justify-content-center flex'>
          <Link to='/' className=''>
            <div className='ui-border-box'>
              <div className='navigation-bar-text' onClick={() => clearEverything()}>Andromeda</div>
            </div>
          </Link>
        </div>
        <div className='justify-content-center flex'>
        <div className=' flex'>
          { /* Sector */}
          <Link to={`/${userSector}`} className='navigation-bar-text' onClick={() => clearPlanetAndSystem()}>
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
          <Link to={isNCO ? `/${userSector}/${userSystem}` : `/${userSector}/system/${userSystem}`}> 
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
    </div>
  );
};
