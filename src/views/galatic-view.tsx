import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setSector } from '../redux/sectorSlice';
import '../styles/views-styles/galatic-view.css';

export const GalaticView = () => {
  const dispatch = useAppDispatch();
  const sectors = useAppSelector((state) => state.sector);

  return (
    <div>
      <div className='side-bar'>news & updates: <br />
        still working on that front end
      </div>
      <div className='sectorawrapper'>
        
        <img src='./assets/sample-image.png'></img>
        <Link
          to='/sector-a'
          onClick={() => dispatch(setSector(sectors.activeSector))}
          className='sectora'
        >
          {' '}
          SECTOR A
          <br /> 
          First time? 
          <br />
          Run generate before clicking otherwise it will fail
        </Link>
      </div>
    </div>
  );
};
