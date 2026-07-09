import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../non-game-pages/AuthProvider/context/AuthContext';
import { playerRawResources } from '../player-data/raw-resources';
import { playerRefinedResources } from '../player-data/refined-resources';
import { playerRareResources } from '../player-data/rare-resources';

const MOCK_FLEETS = [
  { id: 1, name: 'Alpha Fleet',   ships: 4, location: 'Veridia',   status: 'Idle' },
  { id: 2, name: 'Strike Wing',   ships: 2, location: 'Korrath',   status: 'In transit' },
  { id: 3, name: 'Patrol Group',  ships: 6, location: 'Elyndra',   status: 'Patrolling' },
];

const STATUS_COLOR: Record<string, string> = {
  'Idle':       'rgba(255,255,255,0.3)',
  'In transit': '#d17a00',
  'Patrolling': '#7CBDBD',
};

export const NavigationBar = () => {
  const [userSector, setUserSector] = useState('');
  const [userSystem, setUserSystem] = useState('');
  const [userPlanet, setUserPlanet] = useState('');
  const [isNCO, setIsNCO] = useState(false);
  const [coloniesOpen, setColoniesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [fleetsOpen, setFleetsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const coloniesRef  = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const fleetsRef    = useRef<HTMLDivElement>(null);

  const { user } = useContext(AuthContext);
  const claimedSlots: string[] = user?.claimedSlots ?? [];

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

  // close all dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (coloniesRef.current  && !coloniesRef.current.contains(t))  setColoniesOpen(false);
      if (resourcesRef.current && !resourcesRef.current.contains(t)) setResourcesOpen(false);
      if (fleetsRef.current    && !fleetsRef.current.contains(t))    setFleetsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeOthers = (keep: 'colonies' | 'resources' | 'fleets') => {
    if (keep !== 'colonies')  setColoniesOpen(false);
    if (keep !== 'resources') setResourcesOpen(false);
    if (keep !== 'fleets')    setFleetsOpen(false);
  };

  const rawEntries     = Object.entries(playerRawResources)      as [string, number][];
  const refinedEntries = Object.entries(playerRefinedResources)   as [string, number][];
  const rareEntries    = (Object.entries(playerRareResources) as [string, number][]).filter(([, v]) => v > 0);

  const clearAll             = () => { setUserSector(''); setUserSystem(''); setUserPlanet(''); };
  const clearPlanetAndSystem = () => { setUserSystem(''); setUserPlanet(''); };

  const goToColony = (slot: string) => {
    const [sector, system, planet] = slot.split('/');
    setColoniesOpen(false);
    setUserSector(sector);
    setUserSystem(system);
    setUserPlanet(planet);
    navigate(`/${sector}/system/${system}/planet/${planet}`);
  };

  return (
    <nav className='top-nav'>
      <Link to='/' className='top-nav-brand' onClick={clearAll}>Andromeda</Link>

      <div className='top-nav-breadcrumb'>
        {userSector && (
          <>
            <Link to={`/${userSector}`} className='top-nav-crumb' onClick={clearPlanetAndSystem}>
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

      <div className='top-nav-right'>

        {/* ── Resources ── */}
        {user && (
          <div className='res-menu' ref={resourcesRef}>
            <button
              className={`res-btn${resourcesOpen ? ' res-btn--open' : ''}`}
              onClick={() => { closeOthers('resources'); setResourcesOpen(o => !o); }}
              title='Resources'
            >
              <img src='/assets/UI-icons/economy.png' alt='resources' className='colonies-btn-icon' />
              <span className='colonies-btn-count'>Resources</span>
            </button>

            {resourcesOpen && (
              <div className='res-dropdown'>
                <p className='colonies-dropdown-title'>Resources</p>
                <div className='res-sections'>
                  <div className='res-section'>
                    <p className='res-section-label'>Raw</p>
                    {rawEntries.map(([key, val]) => (
                      <div key={key} className='res-row'>
                        <span className='res-row-name'>{key}</span>
                        <span className='res-row-val'>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className='res-section'>
                    <p className='res-section-label'>Refined</p>
                    {refinedEntries.map(([key, val]) => (
                      <div key={key} className='res-row'>
                        <span className='res-row-name'>{key}</span>
                        <span className='res-row-val'>{val}</span>
                      </div>
                    ))}
                  </div>
                  {rareEntries.length > 0 && (
                    <div className='res-section'>
                      <p className='res-section-label'>Unique</p>
                      {rareEntries.map(([key, val]) => (
                        <div key={key} className='res-row'>
                          <span className='res-row-name'>{key.replace('-crystals', '')}</span>
                          <span className='res-row-val res-row-val--rare'>{val}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Fleets ── */}
        {user && (
          <div className='fleets-menu' ref={fleetsRef}>
            <button
              className={`fleets-btn${fleetsOpen ? ' fleets-btn--open' : ''}`}
              onClick={() => { closeOthers('fleets'); setFleetsOpen(o => !o); }}
              title='My fleets'
            >
              <img src='/assets/UI-icons/military.png' alt='fleets' className='colonies-btn-icon' />
              <span className='colonies-btn-count'>{MOCK_FLEETS.length}</span>
            </button>

            {fleetsOpen && (
              <div className='fleets-dropdown'>
                <p className='colonies-dropdown-title'>My Fleets</p>
                {MOCK_FLEETS.length === 0 ? (
                  <p className='colonies-dropdown-empty'>No fleets</p>
                ) : (
                  <ul className='fleets-list'>
                    {MOCK_FLEETS.map(fleet => (
                      <li key={fleet.id} className='fleets-item'>
                        <div className='fleets-item-top'>
                          <span className='fleets-item-name'>{fleet.name}</span>
                          <span
                            className='fleets-item-status'
                            style={{ color: STATUS_COLOR[fleet.status] ?? 'rgba(255,255,255,0.4)' }}
                          >
                            {fleet.status}
                          </span>
                        </div>
                        <div className='fleets-item-bottom'>
                          <span className='fleets-item-detail'>{fleet.ships} ships</span>
                          <span className='fleets-item-detail'>{fleet.location}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Colonies ── */}
        {user && (
          <div className='colonies-menu' ref={coloniesRef}>
            <button
              className={`colonies-btn${coloniesOpen ? ' colonies-btn--open' : ''}`}
              onClick={() => { closeOthers('colonies'); setColoniesOpen(o => !o); }}
              title='My colonies'
            >
              <img src='/assets/UI-icons/resource-icon.png' alt='colonies' className='colonies-btn-icon' />
              <span className='colonies-btn-count'>{claimedSlots.length}/10</span>
            </button>

            {coloniesOpen && (
              <div className='colonies-dropdown'>
                <p className='colonies-dropdown-title'>My Colonies</p>
                {claimedSlots.length === 0 ? (
                  <p className='colonies-dropdown-empty'>No colonies yet</p>
                ) : (
                  <ul className='colonies-list'>
                    {claimedSlots.map((slot) => {
                      const [sector, system, planet] = slot.split('/');
                      return (
                        <li key={slot} className='colonies-item' onClick={() => goToColony(slot)}>
                          <span className='colonies-item-planet'>★ {planet}</span>
                          <span className='colonies-item-system'>{system} · {sector}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        <div className='top-nav-auth'>
          <Link to='/login' className='top-nav-auth-link'>Login</Link>
          <Link to='/register' className='top-nav-auth-link'>Register</Link>
        </div>
      </div>
    </nav>
  );
};
