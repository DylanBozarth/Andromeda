import { useEffect, useState } from 'react';
import { useFleets, MAX_FLEETS } from './useFleets';
import { Fleet } from './types';
import { SHIP_TYPES } from './shipTypes';

const STATUS_LABEL: Record<string, string> = {
  idle: 'Idle',
  'in-transit': 'In Transit',
  'in-battle': 'In Battle',
  retreating: 'Retreating',
};

interface Props {
  onClose: () => void;
}

export const FleetManager = ({ onClose }: Props) => {
  const { fleets, loading, error, atLimit, refresh, removeFleet } = useFleets();
  const [confirmDisband, setConfirmDisband] = useState<string | null>(null);
  const [disbanding, setDisbanding] = useState(false);

  useEffect(() => { refresh(); }, [refresh]);

  const handleDisband = async (fleetId: string) => {
    setDisbanding(true);
    try {
      await removeFleet(fleetId);
    } finally {
      setDisbanding(false);
      setConfirmDisband(null);
    }
  };

  return (
    <div className='fleet-manager-overlay' onClick={onClose}>
      <div className='fleet-manager-panel' onClick={e => e.stopPropagation()}>
        <div className='fleet-manager-header'>
          <h2 className='fleet-manager-title'>
            Fleets — {fleets.length}/{MAX_FLEETS}
          </h2>
          <button className='fleet-manager-close' onClick={onClose}>✕</button>
        </div>

        {error && <p className='fleet-manager-error'>{error}</p>}

        {loading ? (
          <p className='fleet-manager-empty'>Loading…</p>
        ) : fleets.length === 0 ? (
          <p className='fleet-manager-empty'>No fleets. Assign ships from a planet hangar to form one.</p>
        ) : (
          <div className='fleet-manager-list'>
            {fleets.map(fleet => {
              const isConfirming = confirmDisband === fleet.id;
              return (
                <div key={fleet.id} className='fleet-card'>
                  <div className='fleet-card-header'>
                    <span className='fleet-card-name'>{fleet.name}</span>
                    <span className={`fleet-card-status fleet-card-status--${fleet.status}`}>
                      {STATUS_LABEL[fleet.status] ?? fleet.status}
                    </span>
                    <button
                      className='fleet-card-disband-btn'
                      disabled={fleet.status !== 'idle' || disbanding}
                      onClick={() => setConfirmDisband(fleet.id)}
                      title='Disband fleet'
                    >
                      ✕
                    </button>
                  </div>

                  <div className='fleet-card-power'>
                    ⚡ {fleet.power}/{fleet.maxPower}
                    <span className='fleet-card-location'>
                      {fleet.location ? `· ${fleet.location}` : ''}
                      {fleet.destination ? ` → ${fleet.destination}` : ''}
                    </span>
                  </div>

                  <div className='fleet-card-ships'>
                    {fleet.ships.map(ship => {
                      const def = SHIP_TYPES.find(d => d.type === ship.type);
                      return (
                        <span key={ship.id} className='fleet-card-ship-chip' title={ship.name}>
                          {def?.icon ?? '🚀'}
                        </span>
                      );
                    })}
                    {fleet.ships.length === 0 && (
                      <span className='fleet-card-ship-empty'>No ships assigned</span>
                    )}
                  </div>

                  {isConfirming && (
                    <div className='fleet-card-confirm'>
                      <span>Disband fleet?</span>
                      <button
                        className='fleet-confirm-btn fleet-confirm-btn--yes'
                        disabled={disbanding}
                        onClick={() => handleDisband(fleet.id)}
                      >
                        {disbanding ? '…' : 'Yes'}
                      </button>
                      <button
                        className='fleet-confirm-btn fleet-confirm-btn--no'
                        disabled={disbanding}
                        onClick={() => setConfirmDisband(null)}
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {atLimit && (
          <p className='fleet-manager-limit-notice'>
            Fleet limit reached ({MAX_FLEETS}). Disband a fleet to create a new one.
          </p>
        )}
      </div>
    </div>
  );
};
