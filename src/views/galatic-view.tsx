import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import '../styles/views-styles/galatic-view.css';
import { useEffect } from 'react';
import { fetchSectorData } from '../redux/sectorSlice';

export const GalaticView = () => {
  const dispatch = useAppDispatch();
  const activeSector = useAppSelector((state) => state.sector.activeSector);
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
        <img src='./assets/sample-image.png'></img>
        <Link
          to='/sector-a'
          // onClick={() => dispatch(setSector(sectors.activeSector))}
          className='sectora'
        >
          Give it a few seconds before clicking this to make the network call
        </Link>
      </div>
    </div>
  );
};
