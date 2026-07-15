import { useEffect, useState } from 'react';
import { BUILDING_TYPES } from './buildingTypes';
import {
  fetchPlanetBuildings,
  constructBuilding,
  PlanetBuilding,
} from '../../clientLibrary/buildings';

interface Props {
  onClose: () => void;
  sectorName: string;
  systemName: string;
  planetName: string;
}

export const BuildingMenu = ({ onClose, sectorName, systemName, planetName }: Props) => {
  const [built, setBuilt] = useState<PlanetBuilding[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sectorName || !systemName || !planetName) return;
    fetchPlanetBuildings(sectorName, systemName, planetName).then(setBuilt).catch(() => {});
  }, [sectorName, systemName, planetName]);

  const builtMap: Record<string, number> = {};
  for (const b of built) builtMap[b.buildingType] = b.level;

  const handleBuild = async (type: string) => {
    setPending(type);
    setError('');
    try {
      await constructBuilding(sectorName, systemName, planetName, type);
      const updated = await fetchPlanetBuildings(sectorName, systemName, planetName);
      setBuilt(updated);
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
          {error && <p className='building-overlay-error'>{error}</p>}

          <div className='building-overlay-grid'>
            {BUILDING_TYPES.map((def) => {
              const level = builtMap[def.type] ?? 0;
              const maxed = level >= def.maxLevel;
              const busy  = pending === def.type;

              return (
                <div
                  key={def.type}
                  className={[
                    'building-card',
                    level > 0 ? 'building-card--built' : '',
                    maxed     ? 'building-card--maxed'  : '',
                  ].join(' ').trim()}
                >
                  <div className='building-card-top'>
                    <div className='building-card-icon'>{def.icon}</div>
                    {level > 0 && (
                      <span className='building-card-badge'>
                        {maxed ? `MAX` : `Lv ${level}`}
                      </span>
                    )}
                  </div>
                  <div className='building-card-name'>{def.displayName}</div>
                  <div className='building-card-desc'>{def.description}</div>

                  <div className='building-card-footer'>
                    <div className='building-card-cost'>Free · Instant</div>
                    <button
                      className='building-card-btn'
                      disabled={maxed || busy}
                      onClick={() => handleBuild(def.type)}
                    >
                      {busy ? 'Building…' : maxed ? 'Max' : level > 0 ? 'Upgrade' : 'Build'}
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
