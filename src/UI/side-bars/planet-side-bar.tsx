import { Planet } from '../../types/planet-interface';
import { useState, useContext } from 'react';
import { AuthContext } from '../../non-game-pages/AuthProvider/context/AuthContext';
import { useGame } from '../../context/GameContext';
import { claimPlanet } from '../../clientLibrary/planets';

const TABS = [
  { key: 'production', label: 'Production', icon: '/assets/UI-icons/economy.png' },
  { key: 'hangar',     label: 'Hangar',     icon: '/assets/UI-icons/ship-icon.jpeg' },
  { key: 'resources',  label: 'Deposits',   icon: '/assets/UI-icons/resource-icon.png' },
  { key: 'military',   label: 'Military',   icon: '/assets/UI-icons/military.png' },
] as const;

type TabKey = typeof TABS[number]['key'];

interface Props { playerPlanet: Planet; }

export const PlanetSideBar = ({ playerPlanet }: Props) => {
  const [activeTab, setActiveTab] = useState<TabKey>('production');
  const [panelOpen, setPanelOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');

  const { user, setUser } = useContext(AuthContext);
  const { sector, activeSystem, fetchSector } = useGame();

  const claimedSlots: string[] = user?.claimedSlots ?? [];

  const slots = playerPlanet.populationSlots ?? [];
  const occupiedSlots = slots.filter(s => s.occupant !== null);
  const hasEmptySlot = slots.some(s => s.occupant === null);
  const userSlot = slots.find(s => s.occupant === user?.username);

  const claimKey = sector && activeSystem
    ? `${sector.sectorName}/${activeSystem.systemName}/${playerPlanet.name}`
    : '';
  const alreadyClaimedThis = claimedSlots.includes(claimKey);
  const atLimit = claimedSlots.length >= 10;
  const canClaim = hasEmptySlot && !alreadyClaimedThis && !atLimit;

  const handleClaim = async () => {
    if (!sector || !activeSystem) return;
    setClaiming(true);
    setClaimError('');
    try {
      await claimPlanet(sector.sectorName, activeSystem.systemName, playerPlanet.name);
      await fetchSector();
      setUser();
    } catch (err: any) {
      setClaimError(err.message ?? 'Could not claim planet');
    } finally {
      setClaiming(false);
    }
  };

  const handleTabClick = (key: TabKey) => {
    if (activeTab === key) {
      setPanelOpen(o => !o);
    } else {
      setActiveTab(key);
      setPanelOpen(true);
    }
  };

  const claimLabel = () => {
    if (claiming) return 'Settling…';
    if (userSlot) return 'Your colony';
    if (alreadyClaimedThis) return 'Already settled here';
    if (atLimit) return 'Colony limit reached (10)';
    if (!hasEmptySlot) return 'Planet full';
    return 'Settle here';
  };

  return (
    <aside className={`planet-panel${panelOpen ? ' planet-panel--open' : ''}`}>
      {/* drag handle — mobile only */}
      <div className='planet-panel-handle' onClick={() => setPanelOpen(o => !o)} aria-label='Toggle panel'>
        <div className='planet-panel-handle-bar' />
      </div>

      {/* header */}
      <div className='planet-panel-header'>
        <p className='planet-panel-title'>{playerPlanet.name}</p>
        <p className='planet-panel-subtitle'>
          {playerPlanet.class.replace(/\d+$/, '')} · {occupiedSlots.length}/{slots.length} settlers
        </p>
      </div>

      {/* tab strip */}
      <div className='planet-panel-tabs'>
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`planet-panel-tab${activeTab === key ? ' planet-panel-tab--active' : ''}`}
            onClick={() => handleTabClick(key)}
            title={label}
          >
            <img src={icon} alt={label} className='planet-panel-tab-icon' />
            <span className='planet-panel-tab-label'>{label}</span>
          </button>
        ))}
      </div>

      {/* tab content */}
      <div className='planet-panel-body'>
        {activeTab === 'production' && (
          <div className='planet-panel-section'>
            <p className='planet-panel-empty'>
              {playerPlanet.production?.length ? playerPlanet.production.join(', ') : 'No active production'}
            </p>
          </div>
        )}

        {activeTab === 'hangar' && (
          <div className='planet-panel-section'>
            {playerPlanet.hangar.length === 0
              ? <p className='planet-panel-empty'>Hangar is empty</p>
              : playerPlanet.hangar.map((ship, i) => (
                  <div key={i} className='planet-panel-row'>{ship}</div>
                ))
            }
          </div>
        )}

        {activeTab === 'resources' && (
          <div className='planet-panel-section'>
            {playerPlanet.naturalResources.length === 0
              ? <p className='planet-panel-empty'>No deposits found</p>
              : playerPlanet.naturalResources.map((r, i) => (
                  <div key={i} className='planet-panel-row'>{r}</div>
                ))
            }
            {playerPlanet.resourceStorage.length > 0 && (
              <>
                <p className='planet-panel-section-label'>In storage</p>
                {playerPlanet.resourceStorage.map((r, i) => (
                  <div key={i} className='planet-panel-row'>{r}</div>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === 'military' && (
          <div className='planet-panel-section'>
            {playerPlanet.buildings.length === 0
              ? <p className='planet-panel-empty'>No military buildings</p>
              : playerPlanet.buildings.map((b, i) => (
                  <div key={i} className='planet-panel-row'>{b}</div>
                ))
            }
            {playerPlanet.orbit.length > 0 && (
              <>
                <p className='planet-panel-section-label'>In orbit</p>
                {playerPlanet.orbit.map((ship, i) => (
                  <div key={i} className='planet-panel-row'>{ship}</div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div className='planet-panel-footer'>
        <p className='planet-panel-section-label'>
          Population slots &mdash; {occupiedSlots.length}/{slots.length}
        </p>
        <div className='planet-slots'>
          {slots.map(slot => {
            const isYours = slot.occupant === user?.username;
            const initials = slot.occupant
              ? slot.occupant.slice(0, 2).toUpperCase()
              : null;
            return (
              <div
                key={slot.slotId}
                className={`planet-slot${slot.occupant ? (isYours ? ' planet-slot--yours' : ' planet-slot--occupied') : ' planet-slot--empty'}`}
                title={slot.occupant ?? 'Empty'}
              >
                <div className='planet-slot-avatar'>
                  {isYours ? '★' : initials ?? '+'}
                </div>
                <span className='planet-slot-name'>
                  {slot.occupant ?? 'Open'}
                </span>
              </div>
            );
          })}
        </div>
        {claimError && <p className='planet-panel-claim-error'>{claimError}</p>}
        <button
          className='ui-border-box planet-panel-claim'
          onClick={handleClaim}
          disabled={!canClaim || claiming || !!userSlot}
          title={claimLabel()}
        >
          {claimLabel()}
        </button>
      </div>
    </aside>
  );
};
