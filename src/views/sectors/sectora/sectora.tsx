import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from '../../../components/star';
import componentStyles from '../../../styles/components.module.css';
import { PlayerSystem, Sector } from '../../../types/system-interfaces';
import { generateRandomNumber } from '../../../utils/math';
import { MOCK_SECTOR_ARRAY } from './MOCK_DATA';

interface PlayerSystemProps {
  playerSystem: PlayerSystem;
  setPlayerSystem: (system: any) => void;
}

export const SectorA = ({ playerSystem, setPlayerSystem }: PlayerSystemProps) => {
  const [sector, setSector] = React.useState<Sector[]>(MOCK_SECTOR_ARRAY);
  useEffect(() => {
    console.log(playerSystem);
  });
  {
    return (
      <div className={componentStyles['sector-view-wrapper']}>
        {sector.map((sector) => {
          return (
            <div
              key={sector.systemName}
              style={{
                position: 'absolute',
                top: `${generateRandomNumber(20, 80)}vh`,
                left: `${generateRandomNumber(20, 80)}vw`,
              }}
              className={componentStyles['sector-star-wrapper']}
            >
              <Link to={`/system/${sector.systemName}`} onClick={() => setPlayerSystem({ sector })}>
                <Star systemName={sector.systemName} systemStar={sector.systemStar} />
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
};
