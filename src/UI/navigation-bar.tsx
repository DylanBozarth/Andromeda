import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const NavigationBar = () => {
  const [userSector, setUserSector] = useState('');
  const [userSystem, setUserSystem] = useState('');
  const [userPlanet, setUserPlanet] = useState('');
  const [isNCO, setIsNCO] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const currentLocation = location.pathname;
    const splitLocation = currentLocation.split('/');
    if (currentLocation.includes('sector')) {
      userSector === '' ? setUserSector(splitLocation[1]) : '';
    }
    if (/\d/.test(currentLocation)) {
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

  const clearAll = () => { setUserSector(''); setUserSystem(''); setUserPlanet(''); };
  const clearPlanetAndSystem = () => { setUserSystem(''); setUserPlanet(''); };

  return (
    <nav className='top-nav'>
      <Link to='/' className='top-nav-brand' onClick={clearAll}>Andromeda</Link>

      <div className='top-nav-breadcrumb'>
        {userSector && (
          <>
            <Link
              to={`/${userSector}`}
              className='top-nav-crumb'
              onClick={clearPlanetAndSystem}
            >
              {userSector}
            </Link>
          </>
        )}
        {userSystem && (
          <>
            <span className='top-nav-sep'>›</span>
            <Link
              to={isNCO ? `/${userSector}/${userSystem}` : `/${userSector}/system/${userSystem}`}
              className='top-nav-crumb'
              onClick={() => setUserPlanet('')}
            >
              {userSystem}
            </Link>
          </>
        )}
        {userPlanet && (
          <>
            <span className='top-nav-sep'>›</span>
            <span className='top-nav-crumb top-nav-crumb--active'>{userPlanet}</span>
          </>
        )}
      </div>

      <div className='top-nav-auth'>
        <Link to='/login' className='top-nav-auth-link'>Login</Link>
        <Link to='/register' className='top-nav-auth-link'>Register</Link>
      </div>
    </nav>
  );
};
