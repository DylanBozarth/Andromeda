import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setSector } from '../redux/sectorSlice';
import '../styles/views-styles/galatic-view.module.css';

export const GalaticView = () => {
  const dispatch = useAppDispatch();
  const sectors = useAppSelector((state) => state.sector);
  console.log({ sectors });
  return (
    <div>
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
          Run generate before clicking
        </Link>
      </div>
    </div>
  );
};
