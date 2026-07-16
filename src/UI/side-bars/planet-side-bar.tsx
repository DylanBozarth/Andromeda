import { Planet } from '../../types/planet-interface';
import { useState, useContext } from 'react';
import { AuthContext } from '../../non-game-pages/AuthProvider/context/AuthContext';
import { useGame } from '../../context/GameContext';
import { PlanetBuilding, cancelBuilding } from '../../clientLibrary/buildings';
import { BUILDING_TYPES } from '../buildings/buildingTypes';
import { BuildingProgressBar } from '../buildings/BuildingProgressBar';
import { BuildShipPanel } from '../../fleets/BuildShipPanel';
import { Ship } from '../../fleets/types';
import { SHIP_TYPES } from '../../fleets/shipTypes';

const TABS = [
  { key: 'production', label: 'Production', icon: '/assets/UI-icons/economy.png' },
  { key: 'hangar',     label: 'Hangar',     icon: '/assets/UI-icons/ship-icon.jpeg' },
  { key: 'resources',  label: 'Deposits',   icon: '/assets/UI-icons/resource-icon.png' },
  { key: 'military',   label: 'Military',   icon: '/assets/UI-icons/military.png' },
] as const;

type TabKey = typeof TABS[number]['key'];

interface Props {
  playerPlanet: Planet;
  buildings: PlanetBuilding[];
  shipsInProduction: Ship[];
  onCancelBuild: (type: string) => Promise<void>;
  onShipBuilt: () => void;
}

export const PlanetSideBar = ({ playerPlanet, buildings, shipsInProduction, onCancelBuild, onShipBuilt }: Props) => {
  const [activeTab, setActiveTab] = useState<TabKey>('production');
  const [panelOpen, setPanelOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const { user } = useContext(AuthContext);
  const { sector, activeSystem } = useGame();

  const slots = playerPlanet.populationSlots ?? [];
  const occupiedSlots = slots.filter(s => s.occupant !== null);
  const userSlot = slots.find(s => s.occupant === user?.username);

  const handleConfirmCancel = async () => {
    if (!confirmCancel) return;
    setCancelling(true);
    try {
      await onCancelBuild(confirmCancel);
    } finally {
      setCancelling(false);
      setConfirmCancel(null);
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

  return (
    <aside className={`planet-panel${panelOpen ? ' planet-panel--open' : ''}`}>
      <div className='planet-panel-handle' onClick={() => setPanelOpen(o => !o)} aria-label='Toggle panel'>
        <div className='planet-panel-handle-bar' />
      </div>

      <div className='planet-panel-header'>
        <p className='planet-panel-title'>{playerPlanet.name}</p>
        <p className='planet-panel-subtitle'>
          {playerPlanet.class.replace(/\d+$/, '')} · {occupiedSlots.length}/{slots.length} settlers
        </p>
      </div>

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

      <div className='planet-panel-body'>
        {activeTab === 'production' && (
          <div className='planet-panel-section'>
            {shipsInProduction.map(ship => {
              const def = SHIP_TYPES.find(d => d.type === ship.type);
              return (
                <div key={ship.id} className='construction-item'>
                  <div className='construction-item-header'>
                    <span className='construction-item-icon'>{def?.icon ?? '🚀'}</span>
                    <span className='construction-item-name'>{ship.name}</span>
                  </div>
                  <BuildingProgressBar
                    startedAt={ship.startedAt}
                    durationSeconds={ship.durationSeconds}
                    queued={false}
                  />
                </div>
              );
            })}
            {buildings.filter(b => b.status === 'constructing' || b.status === 'queued').length === 0 && shipsInProduction.length === 0 ? (
              <p className='planet-panel-empty'>No active construction</p>
            ) : buildings.filter(b => b.status === 'constructing' || b.status === 'queued').length > 0 ? (
              [...buildings]
                .filter(b => b.status === 'constructing' || b.status === 'queued')
                .sort((a, b) => {
                  if (a.status === 'constructing') return -1;
                  if (b.status === 'constructing') return 1;
                  return (a.queuePosition ?? 99) - (b.queuePosition ?? 99);
                })
                .map(b => {
                  const def = BUILDING_TYPES.find(t => t.type === b.buildingType);
                  const isConfirming = confirmCancel === b.buildingType;
                  return (
                    <div key={b.buildingType} className={`construction-item${b.status === 'queued' ? ' construction-item--queued' : ''}`}>
                      <div className='construction-item-header'>
                        <span className='construction-item-icon'>{def?.icon ?? '🏗'}</span>
                        <span className='construction-item-name'>
                          {def?.displayName ?? b.buildingType}
                          {b.level > 1 ? ` (Lv ${b.level})` : ''}
                        </span>
                        {b.status === 'queued' && (
                          <span className='construction-item-queue-badge'>#{b.queuePosition}</span>
                        )}
                        <button
                          className='construction-item-cancel-btn'
                          onClick={() => setConfirmCancel(b.buildingType)}
                          title='Cancel'
                        >✕</button>
                      </div>
                      <BuildingProgressBar
                        startedAt={b.startedAt}
                        durationSeconds={b.durationSeconds}
                        queued={b.status === 'queued'}
                      />
                      {isConfirming && (
                        <div className='construction-confirm'>
                          <span className='construction-confirm-text'>Cancel build?</span>
                          <div className='construction-confirm-actions'>
                            <button
                              className='construction-confirm-btn construction-confirm-btn--yes'
                              onClick={handleConfirmCancel}
                              disabled={cancelling}
                            >
                              {cancelling ? '…' : 'Yes'}
                            </button>
                            <button
                              className='construction-confirm-btn construction-confirm-btn--no'
                              onClick={() => setConfirmCancel(null)}
                              disabled={cancelling}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            ) : null}
          </div>
        )}

        {activeTab === 'hangar' && (
          <div className='planet-panel-section'>
            {buildings.length === 0 ? (
              <p className='planet-panel-empty'>Build a structure on this planet to unlock ship construction.</p>
            ) : sector && activeSystem ? (
              <BuildShipPanel
                sectorName={sector.sectorName}
                systemName={activeSystem.systemName}
                planetName={playerPlanet.name}
                buildings={buildings}
                onShipOrdered={onShipBuilt}
              />
            ) : null}
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
      </div>
    </aside>
  );
};
