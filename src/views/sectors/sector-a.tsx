import { Link } from 'react-router-dom';
import { Star } from '../../components/star';
import { useGame } from '../../context/GameContext';
import { getXfromCords, getYfromCords } from '../../utils/system-generator/system-functions';
import { NCOComponent } from '../../components/NCO';
import { useState } from 'react';
import { SectorSideBar } from '../../UI/side-bars/sector-side-bar';

export const SectorA = () => {
  const { sector, setActiveSystem, setActiveNCO } = useGame();
  const [hidden, setHidden] = useState('');

  if (!sector) return null;

  return (
    <div className='sector-view'>
      <div className='sector-background'></div>
      <SectorSideBar />
      <div className=''>
        {sector.systems.map((item) => (
          <div
            key={item.systemName}
            style={{
              left: `${getXfromCords(item.cords)}vw`,
              top: `${getYfromCords(item.cords)}vh`,
            }}
            className='relative sector-star'
            onMouseOver={() => setHidden(item.systemName)}
          >
            <Link
              to={`/${sector.sectorName}/system/${item.systemName}`}
              onClick={() => setActiveSystem(item)}
            >
              <Star systemName={item.systemName} systemStar={item.systemStar} />
            </Link>
            <div className={hidden === item.systemName ? 'sector-ownership-menu' : 'hidden'}>
              {item.systemName}, {item.systemStar}, {item.cords}
              {item.systemPlanets.map((planet) => (
                <div key={planet.name}>{planet.ownership}</div>
              ))}
            </div>
          </div>
        ))}
        {sector.NCO.map((single) => (
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
              onClick={() => setActiveNCO(single)}
            >
              <NCOComponent
                NCOType={single.type}
                effect={single.effect}
                cords={single.cords}
                NCOName={single.name}
              />
            </Link>
            <div className={hidden === single.name ? 'asda' : 'hidden'}>
              {single.type}, <br /> {single.name} <br /> {single.cords}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
