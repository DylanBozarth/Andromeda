import { Link } from 'react-router-dom';
import { Star } from '../../components/star';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSystem, setNCO } from '../../redux/sectorSlice';
import { getXfromCords, getYfromCords } from '../../utils/system-generator/system-functions';
import { NCOComponent } from '../../components/NCO';
import '../../styles/views-styles/sector-view.css';
import { useState } from 'react';
import { SectorSideBar } from '../../UI/side-bars/sector-side-bar';

export const SectorA = () => {
  const dispatch = useAppDispatch();
  const [hidden, setHidden] = useState('');
  const sector = useAppSelector((state) => state.sector.activeSector.sector);
  {
    return (
      <div className='sector-view '>
        <div className='sector-background'></div>
        <SectorSideBar />
        <div className=''>
          
          {sector.systems.map((item) => {
            return (
              <div
                key={item.systemName}
                style={{
                  left: `${getXfromCords(item.cords)}vw`,
                  top: `${getYfromCords(item.cords)}vh`,
                }}
                className='relative  sector-star'
                onMouseOver={() => setHidden(item.systemName)}
              >
                <Link
                  to={`/${sector.sectorName}/system/${item.systemName}`}
                  onClick={() => dispatch(setSystem(item))}
                >
                  <Star
                    systemName={item.systemName}
                    systemStar={item.systemStar}
                    distanceMapValues={sector.distancesMap[item.systemName]}
                  />
                </Link>
                <div className={hidden === item.systemName ? 'sector-ownership-menu' : 'hidden'}>
                  {item.systemName}, {item.systemStar}
                  {item.systemPlanets.map((planets) => {
                    return <div key={planets.name}>{planets.ownership}</div>;
                  })}
                </div>
              </div>
            );
          })}
          {sector.NCO.map((single) => {
            return (
              <div
                key={single.cords}
                style={{
                  left: `${getXfromCords(single.cords)}vw`,
                  top: `${getYfromCords(single.cords)}vh`,
                }}
                onMouseOver={() => setHidden(single.name)}
                className='relative sector-star'
              >
                <Link
                  to={`/${sector.sectorName}/${single.name}`}
                  onClick={() => dispatch(setNCO(single))}
                >
                  <NCOComponent
                    NCOType={single.type}
                    effect={single.effect}
                    cords={single.cords}
                    NCOName={single.name}
                    distanceMapValues={sector.distancesMap[single.cords]}
                  />
                </Link>
                <div className={hidden === single.name ? 'asda' : 'hidden'}>
                  {single.type}, <br /> {single.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};
