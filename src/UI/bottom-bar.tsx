import React from 'react';
import { Link } from 'react-router-dom';
export const BottomBar = () => {
    return(
        <div className="bottom-bar">
            I wanted to make this on the bottom
            <li>
              <a href='#'>
                <Link to='/' className=''>
                  Galatic View
                </Link>
              </a>
            </li>
            <li>
              <a href='#'>
                <Link to='/sectora' className=''>
                  SECTOR-A
                </Link>
              </a>
            </li>
            <li>
              <a href='#'>
                <Link to='/redux-sector' className=''>
                  R-Sector
                </Link>
              </a>
            </li>
        </div>
    )
}