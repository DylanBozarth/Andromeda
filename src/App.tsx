import './styles/global.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UImaster } from './UI/user-interface-master';
import { SystemView } from './views/system/system-view';
import { GalaticView } from './views/galatic/galatic-view';
import { SectorA } from './views/sectors/sector-a';
import { PlanetView } from './views/planet/planet-view';
import { NCOView } from './views/NCO/NCO-view';
import { Login } from './non-game-pages/login';
import { Register } from './non-game-pages/register';
import { LoginData } from './non-game-pages/loginData';
import { SystemOrbitalView } from './views/system/orbital-view';

function App() {
  return (
    <BrowserRouter>
      <div className='background-class'></div>
      <UImaster />
      <Routes>
        <Route path='/' element={<GalaticView />} />
        <Route path='/:sectorName' element={<SectorA />} />
        <Route path='/:sectorName/system/:systemName' element={<SystemView />} />
        <Route path='/:sectorName/system/:systemName/orbital' element={<SystemOrbitalView/>} />
        <Route path='/:sectorName/system/:systemName/planet/:planetName' element={<PlanetView />} />
        <Route path='/:sectorName/:nco' element={<NCOView />} /> 
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <div
        className='auth'
        style={{ zIndex: 99, position: 'absolute', bottom: 0, background: '#ccc', color: 'black' }}
      >
      </div>
    </BrowserRouter>
  );
}

export default App;
