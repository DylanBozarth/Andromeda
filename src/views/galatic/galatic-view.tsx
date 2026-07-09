import { Link } from 'react-router-dom';
import '@styles/views-styles/galatic-view.css';
import { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import sampleImage from '@assets/sample-image.png';

export const GalaticView = () => {
  const { sector, sectorLoading, fetchSector } = useGame();

  useEffect(() => {
    if (!sector) fetchSector();
  }, []);

  return (
    <div>
      <div className='side-bar mt-20 border-1 p-2'>
        news & updates: <br />
        10/14/2023: <br />Server connection is back up!<br />
        <div></div>
      </div>

      <div className='sectorawrapper'>
        {!sectorLoading && sector ? (
          <>
            <img src={sampleImage}></img>
            <Link to='/sector-a' className='sectora'>
              Go to Sector-A
            </Link>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};
