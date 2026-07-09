import { Planet } from '../../types/planet-interface';
import { useState } from 'react';

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

  return (
    <aside className='planet-panel'>
      {/* header */}
      <div className='planet-panel-header'>
        <p className='planet-panel-title'>{playerPlanet.name}</p>
        <p className='planet-panel-subtitle'>
          {playerPlanet.class.replace(/\d+$/, '')} · {playerPlanet.ownership}
        </p>
      </div>

      {/* tab strip */}
      <div className='planet-panel-tabs'>
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`planet-panel-tab${activeTab === key ? ' planet-panel-tab--active' : ''}`}
            onClick={() => setActiveTab(key)}
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
              {playerPlanet.production?.length
                ? playerPlanet.production.join(', ')
                : 'No active production'}
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
            {playerPlanet.buildings.filter(b => b).length === 0
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

      {/* footer action */}
      {playerPlanet.ownership === 'unowned' && (
        <div className='planet-panel-footer'>
          <button className='ui-border-box planet-panel-claim'>Claim this planet</button>
        </div>
      )}
    </aside>
  );
};
