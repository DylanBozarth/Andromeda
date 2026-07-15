import { useState } from 'react';
import { BUILDING_TYPES } from './buildingTypes';
import { constructBuilding, PlanetBuilding } from '../../clientLibrary/buildings';

interface Props {
  onClose: () => void;
  buildings: PlanetBuilding[];
  onBuildStart: () => void;
  isClaimed: boolean;
  sectorName: string;
  systemName: string;
  planetName: string;
}

export const BuildingMenu = ({
  onClose,
  buildings,
  onBuildStart,
  isClaimed,
  sectorName,
  systemName,
  planetName,
}: Props) => {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState('');

  const builtMap: Record<string, PlanetBuilding> = {};
  for (const b of buildings) builtMap[b.buildingType] = b;

  const handleBuild = async (type: string) => {
    setPending(type);
    setError('');
    try {
      await constructBuilding(sectorName, systemName, planetName, type);
      onBuildStart();
    } catch (err: any) {
      setError(err.message ?? 'Build failed');
    } finally {
      setPending(null);
    }
  };

  return (
    <div className='building-overlay' onClick={onClose}>
      <div className='building-overlay-panel' onClick={e => e.stopPropagation()}>

        <div className='building-overlay-header'>
          <h2 className='building-overlay-title'>Buildings — {planetName}</h2>
          <button className='building-overlay-close' onClick={onClose}>✕</button>
        </div>

        <div className='building-overlay-body'>
          {!isClaimed && (
            <div className='building-overlay-unclaimed'>
              <span className='building-overlay-unclaimed-icon'>🔒</span>
              <p className='building-overlay-unclaimed-text'>
                You must settle this planet before constructing buildings.
              </p>
            </div>
          )}

          {error && <p className='building-overlay-error'>{error}</p>}

          <div className={`building-overlay-grid${!isClaimed ? ' building-overlay-grid--locked' : ''}`}>
            {BUILDING_TYPES.map((def) => {
              const existing = builtMap[def.type];
              const level = existing?.level ?? 0;
              const isConstructing = existing?.status === 'constructing';
              const isQueued = existing?.status === 'queued';
              const maxed = !isConstructing && !isQueued && level >= def.maxLevel;
              const busy = pending === def.type;

              return (
                <div
                  key={def.type}
                  className={[
                    'building-card',
                    level > 0 && !isConstructing && !isQueued ? 'building-card--built' : '',
                    isConstructing ? 'building-card--constructing' : '',
                    isQueued ? 'building-card--queued' : '',
                    maxed ? 'building-card--maxed' : '',
                  ].join(' ').trim()}
                >
                  <div className='building-card-top'>
                    <div className='building-card-icon'>{def.icon}</div>
                    {isConstructing && (
                      <span className='building-card-badge building-card-badge--constructing'>Building…</span>
                    )}
                    {existing?.status === 'queued' && (
                      <span className='building-card-badge building-card-badge--queued'>
                        Queue #{existing.queuePosition}
                      </span>
                    )}
                    {!isConstructing && existing?.status !== 'queued' && level > 0 && (
                      <span className='building-card-badge'>
                        {maxed ? 'MAX' : `Lv ${level}`}
                      </span>
                    )}
                  </div>

                  <div className='building-card-name'>{def.displayName}</div>
                  <div className='building-card-desc'>{def.description}</div>

                  <div className='building-card-footer'>
                    <div className='building-card-cost'>Free · 1 min</div>
                    <button
                      className='building-card-btn'
                      disabled={!isClaimed || maxed || busy || isConstructing || isQueued}
                      onClick={() => handleBuild(def.type)}
                    >
                      {busy ? '…' : isConstructing ? 'Building…' : isQueued ? 'Queued' : maxed ? 'Max' : level > 0 ? 'Upgrade' : 'Build'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
