import { Link } from 'react-router-dom';
import { Star } from '../../../components/star';
import { useAppSelector } from '../../../redux/hooks';
import componentStyles from '../../../styles/components.module.css';
import { PlayerSystem } from '../../../types/system-interfaces';

interface PlayerSystemProps {
  playerSystem: PlayerSystem;
  setPlayerSystem: (system: any) => void;
}

export const ReduxSector = ({ playerSystem, setPlayerSystem }: PlayerSystemProps) => {
  const sector = useAppSelector((state) => state.sector.activeSector);
  {
    return (
      <div className={componentStyles['sector-view-wrapper']}>
        {sector.map((sector) => {
          return (
            <div
              key={sector.systemName}
              style={{
                position: 'absolute',
                left: `${sector.cords.slice(2, 4)}vw`,
                top: `${sector.cords.slice(4, 6)}vh`,
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
