import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import '../../styles/views-styles/galatic-view.css';
import { useEffect } from 'react';
import { fetchSectorData } from '../../redux/sectorSlice';

export const GalaticView = () => {
  const dispatch = useAppDispatch();
  const activeSector = useAppSelector((state) => state.sector.activeSector.sector);
  const sectorLoading = useAppSelector((state) => state.sector.activeSector.loading);
  useEffect(() => {
    if (!activeSector) {
      dispatch(fetchSectorData());
    }
  }, []);

  return (
    <div>
      <div className='side-bar mt-20 border-1 p-2'>
        news & updates: <br />
        10/14/2023: <br />Server connection is back up!<br />
        <div></div>
      </div>

      <div className='sectorawrapper'>
        {!sectorLoading ? (
          <>
            <img src='./assets/sample-image.png'></img>
            <Link to='/sector-a' className='sectora'>
              Go to Sector-A
            </Link>
          </>
        ) : (
          <div>
            <h1>Still loading</h1>
          </div>
        )}
      </div>
    </div>
  );
};
