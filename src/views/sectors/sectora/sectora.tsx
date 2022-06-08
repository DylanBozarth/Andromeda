import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from '../../../components/star';
import componentStyles from '../../../styles/components.module.css';
import { PlayerSystem, Sector } from '../../../types/system-interfaces';
import { MOCK_SECTOR_ARRAY } from './MOCK_DATA';

interface PlayerSystemProps {
  playerSystem: PlayerSystem;
  setPlayerSystem: (system: any) => void;
}

export const SectorA = ({ playerSystem, setPlayerSystem }: PlayerSystemProps) => {
  const [sector, setSector] = React.useState<Sector[]>(MOCK_SECTOR_ARRAY);
  {
    return (
      <div className={componentStyles['sector-view-wrapper']}>
        {sector.map((sector) => {
          return (
            <div key={sector.id} className={componentStyles['sector-star-wrapper']}>
              <Link to={`/system/${sector.systemName}`} onClick={() => setPlayerSystem({ sector })}>
                <Star systemName={sector.systemName} systemStar={sector.systemStar} />
              </Link>
            </div>
          );
        })}
        Eventually I want these to look more random in their placements so there can be clusters,
        etc.
      </div>
    );
  }
};
