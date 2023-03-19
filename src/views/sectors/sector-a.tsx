import { Link } from 'react-router-dom';
import { Star } from '../../components/star';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSystem } from '../../redux/sectorSlice';
import { getXfromCords, getYfromCords } from '../../utils/system-generator/system-functions';
import { IconBar } from '../../UI/icon-bar';
import { NCOComponent } from '../../components/NCO';

export const SectorA = () => {
  const dispatch = useAppDispatch();
  const sector = useAppSelector((state) => state.sector.activeSector);
  {
    return (
      <div className='sector-view-wrapper'>
        <div className='sector-background'></div>
        {/* icons for menus */}
        <div>
          <IconBar />
        </div>
        {sector.systems.map((item) => {
          return (

            <div
              key={item.cords}
              style={{
                position: 'absolute',
                left: `${getXfromCords(item.cords)}vw`,
                top: `${getYfromCords(item.cords)}vh`,
              }}
              className='sector-star-wrapper'
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
        {sector.NCO.map((single) => {
                <div>
                  <NCOComponent NCOName={single.name} effect='nice' cords='nice' />
                  </div> })}
      </div>
        
    );
  }
};
