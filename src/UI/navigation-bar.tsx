import '../styles/user-interface-master.scss';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
export const NavigationBar = () => {
  const [userSector, setUserSector] = useState(
    useAppSelector((state) => state.sector.activeSector?.sectorName || ''),
  );
  const [userSystem, setUserSystem] = useState(
    useAppSelector((state) => state.sector.activeSystem?.systemName || ''),
  );
  const [userPlanet, setUserPlanet] = useState(
    useAppSelector((state) =>  state.sector.activeSystem?.activePlanet?.name || '')
  )
  const location = useLocation();
  useEffect(() => {
    if (window.location.href.includes('sector')) {
      const locationURL = window.location.href.split('/');
      setUserSector(locationURL[locationURL.length - 1]);
    } 
    else if (window.location.href.includes('system') && !window.location.href.includes('planet')) {
      const locationURL = window.location.href.split('/');
      setUserSystem(locationURL[locationURL.length - 1]);
    }
    else if (window.location.href.includes('planet')) {
        const locationURL = window.location.href.split('/');
        setUserPlanet(locationURL[locationURL.length - 1]);
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
        <Link to='/'  className=''>
          <div className='ui-border-box'>
            <div className='navigation-bar-text' onClick={() => clearEverything()}>Andromeda</div>
          </div>
        </Link>
      </div>
      <div className='flex justify-content-center'>
    { /* Sector */ }
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
        { /* System */ }
        <Link to={`/system/${userSystem}`}>
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
        { /* planet */ }
        <div
          className={
            userPlanet
              ? 'ui-border-box'
              : ''
          }
        >
          <div className='navigation-bar-text' onClick={() => console.log('PLANET')}>{userPlanet}</div>
        </div>
      </div>
    </div>
  );
};
