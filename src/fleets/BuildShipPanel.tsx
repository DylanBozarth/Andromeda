import { useEffect } from 'react';
import { SHIP_TYPES } from './shipTypes';
import { useHangar } from './useFleets';
import { PlanetBuilding } from '../clientLibrary/buildings';

interface Props {
  sectorName: string;
  systemName: string;
  planetName: string;
  buildings: PlanetBuilding[];
  onShipOrdered?: () => void;
}

export const BuildShipPanel = ({ sectorName, systemName, planetName, buildings, onShipOrdered }: Props) => {
  const { ships, loading, error, buildPending, refresh, orderShip } = useHangar(
    sectorName, systemName, planetName,
  );

  useEffect(() => { refresh(); }, [refresh]);

  const builtTypes = new Set(buildings.map(b => b.buildingType));

  const canBuildType = (requiredBuilding: string) => builtTypes.has(requiredBuilding);

  return (
    <div className='fleet-build-panel'>
      {error && <p className='fleet-build-error'>{error}</p>}

      <p className='fleet-build-label'>Shipyard — order new vessels</p>
      <div className='fleet-build-grid'>
        {SHIP_TYPES.map(def => {
          const unlocked = canBuildType(def.requiresBuilding);
          const busy = buildPending === def.type;
          return (
            <div
              key={def.type}
              className={`fleet-ship-card${!unlocked ? ' fleet-ship-card--locked' : ''}`}
            >
              <div className='fleet-ship-card-icon'>{def.icon}</div>
              <div className='fleet-ship-card-name'>{def.displayName}</div>
              <div className='fleet-ship-card-desc'>{def.description}</div>
              <div className='fleet-ship-card-stats'>
                <span>⚡ {def.power} power</span>
                <span>{Math.round(def.buildTimeSeconds / 60)} min</span>
              </div>
              {!unlocked && (
                <div className='fleet-ship-card-lock'>
                  Requires {def.requiresBuilding.replace('_', ' ')}
                </div>
              )}
              <button
                className='fleet-ship-card-btn'
                disabled={!unlocked || !!buildPending}
                onClick={() => orderShip(def.type).then(() => onShipOrdered?.())}
              >
                {busy ? '…' : 'Build'}
              </button>
            </div>
          );
        })}
      </div>

      <p className='fleet-build-label' style={{ marginTop: '1rem' }}>
        Hangar ({ships.length} ship{ships.length !== 1 ? 's' : ''})
      </p>
      {loading ? (
        <p className='fleet-build-empty'>Loading…</p>
      ) : ships.length === 0 ? (
        <p className='fleet-build-empty'>No ships in hangar</p>
      ) : (
        <div className='fleet-hangar-list'>
          {ships.map(ship => {
            const def = SHIP_TYPES.find(d => d.type === ship.type);
            return (
              <div key={ship.id} className='fleet-hangar-row'>
                <span className='fleet-hangar-icon'>{def?.icon ?? '🚀'}</span>
                <span className='fleet-hangar-name'>{ship.name}</span>
                <span className='fleet-hangar-power'>⚡ {ship.power}/{ship.maxPower}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
