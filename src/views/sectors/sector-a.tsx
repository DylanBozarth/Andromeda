import { Link } from 'react-router-dom';
import { Star } from '../../components/star';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSystem, setNCO } from '../../redux/sectorSlice';
import { getXfromCords, getYfromCords } from '../../utils/system-generator/system-functions';
import { NCOComponent } from '../../components/NCO';
import '../../styles/views-styles/sector-view.css'
import { useEffect } from 'react';

export const SectorA = () => {
  const dispatch = useAppDispatch();
  const sector = useAppSelector((state) => state.sector.activeSector);
  useEffect(() => {
    fetch('https://andromeda-backend-production.up.railway.app/api/sectors')
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      return response.json();
    })
    .then((actualData) => console.log(actualData.data[0].attributes.sectorA))
    .catch((err) => {
      console.log(err.message);
    });
  }, [])
  {
    return (
      <div className=''>
        <div className='sector-background'></div>
        <div className='row'>
        {sector.NCO.map((single) => {
          return (
            <div key={single.cords} style={{
              left: `${getXfromCords(single.cords)}vw`,
              top: `${getYfromCords(single.cords)}vh`,
            }}
              className='relative sector-star'>
              <Link to={`/${sector.sectorName}/${single.name}`} onClick={() => dispatch(setNCO(single))}>
                <NCOComponent NCOType={single.type} effect={single.effect} cords={single.cords} NCOName={single.name} distanceMapValues={sector.distancesMap[single.cords]} />
              </Link>
            </div>
          )
        })}
        {sector.systems.map((item) => {
          return (
            <div
              key={item.systemName}
              style={{
                left: `${getXfromCords(item.cords)}vw`,
                top: `${getYfromCords(item.cords)}vh`,
              }}
              className='relative  sector-star'
            >
              <Link to={`/${sector.sectorName}/system/${item.systemName}`} onClick={() => dispatch(setSystem(item))}>
                <Star
                  systemName={item.systemName}
                  systemStar={item.systemStar}
                  distanceMapValues={sector.distancesMap[item.systemName]}
                />
              </Link>
            </div>
          );
        })}
      </div></div>
    );
  }
};