import './styles/global.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UImaster } from './UI/user-interface-master';
import { SystemView } from './views/system-view';
import { GalaticView } from './views/galatic-view';
import { SystemStarView } from './views/system-star-view';
import { SectorA } from './views/sectors/sector-a';
import { PlanetView } from './views/planet-view';
import { NCOView } from './views/NCO-view';
import { Login } from './non-game-pages/login';
import { Register } from './non-game-pages/register';
import { LoginData } from './non-game-pages/loginData';

function App() {
  return (
    <BrowserRouter>
      <div className='background-class'></div>
      <UImaster />
      <Routes>
        <Route path='/' element={<GalaticView />} />
        <Route path='/:sectorName' element={<SectorA />} />
        <Route path='/:sectorName/system/:systemName' element={<SystemView />} />
        <Route path='/:sectorName/system/:systemName/planet/:planetName' element={<PlanetView />} />
        <Route path='/:sectorName/system/:systemName/:systemStar' element={<SystemStarView />} />
        <Route path='/:sectorName/:nco' element={<NCOView />} /> {/* Hardcoded for now */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <div
        className='auth'
        style={{ zIndex: 99, position: 'absolute', bottom: 0, background: '#ccc', color: 'black' }}
      >
        <Register />
        <Login />
        <LoginData />
      </div>
    </BrowserRouter>
  );
}

export default App;
