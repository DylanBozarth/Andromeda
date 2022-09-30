import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star } from '../../components/star';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSystem } from '../../redux/sectorSlice';
import styles from '../../styles/components.module.css';
import { getXfromCords, getYfromCords } from '../../utils/system-generator/system-functions';

export const SectorA = () => {
  const dispatch = useAppDispatch();
  const sector = useAppSelector((state) => state.sector.activeSector);
  async function getSector() {
    const response = await fetch(
      'https://data.mongodb-api.com/app/data-zrkhi/endpoint/data/v1'
    );
    const json = await response.json();
    console.log(json);
    // setPets(json.pets);
    
  }
  useEffect(() => {
    getSector();
  }, [])
  {
    return (
      <div className={styles['sector-view-wrapper']}>
        <div className={styles['sector-background']}></div>
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
