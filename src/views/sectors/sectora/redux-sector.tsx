import { Link } from 'react-router-dom';
import { Star } from '../../../components/star';
import { useAppSelector } from '../../../redux/hooks';
import componentStyles from '../../../styles/components.module.css';
import { System } from '../../../utils/system-generator/generate-sector';
import { getXfromCords, getYfromCords } from '../../../utils/system-generator/system-functions';

interface PlayerSystemProps {
  playerSystem: System;
  setPlayerSystem: (system: any) => void;
}

export const ReduxSector = ({ playerSystem, setPlayerSystem }: PlayerSystemProps) => {
  const sector = useAppSelector((state) => state.sector.activeSector);
  {
    return (
      <div className={componentStyles['sector-view-wrapper']}>
        {sector.systems.map((item) => {
          return (
            <div
              key={item.cords}
              style={{
                position: 'absolute',
                left: `${getXfromCords(item.cords)}vw`,
                top: `${getYfromCords(item.cords)}vh`,
              }}
              className={componentStyles['sector-star-wrapper']}
            >
              <Link to={`/system/${item.cords}`} onClick={() => setPlayerSystem(item)}>
                <Star
                  systemName={item.cords}
                  systemStar={item.systemStar}
                  distanceMapValues={sector.distancesMap[item.cords]}
                />
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
};
