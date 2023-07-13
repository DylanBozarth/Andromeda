import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import '../styles/views-styles/galatic-view.css';
import { useEffect } from 'react';
import { fetchSectorData } from '../redux/sectorSlice';

export const GalaticView = () => {
  const dispatch = useAppDispatch();
  const activeSector = useAppSelector((state) => state.sector.activeSector.sector);
  const sectorLoading = useAppSelector((state) => state.sector.activeSector.loading);
  useEffect(() => {
    dispatch(fetchSectorData());
  }, []);
  console.log('active sector is', activeSector);

  return (
    <div>
      <div className='side-bar mt-20 border-1'>
        news & updates: <br />
        still working on that front end <br />
        This is where we will put patch notes
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
            <h1>Register at bottom to load sectors</h1>
          </div>
        )}
      </div>
    </div>
  );
};
