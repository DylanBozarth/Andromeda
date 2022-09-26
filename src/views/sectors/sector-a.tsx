import { Link } from 'react-router-dom';
import { Star } from '../../components/star';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSystem } from '../../redux/sectorSlice';
import styles from '../../styles/components.module.css';
import { getXfromCords, getYfromCords } from '../../utils/system-generator/system-functions';

export const ReduxSector = () => {
  const dispatch = useAppDispatch();
  const sector = useAppSelector((state) => state.sector.activeSector);
  {
    return (
      <div className={styles['sector-view-wrapper']}>
        {sector.systems.map((item) => {
          return (
            <div
              key={item.cords}
              style={{
                position: 'absolute',
                left: `${getXfromCords(item.cords)}vw`,
                top: `${getYfromCords(item.cords)}vh`,
              }}
              className={styles['sector-star-wrapper']}
            >
              <Link to={`/system/${item.systemName}`} onClick={() => dispatch(setSystem(item))}>
                <Star
                  systemName={item.systemName}
                  systemStar={item.systemStar}
                  distanceMapValues={sector.distancesMap[item.systemName]}
                />
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
};
