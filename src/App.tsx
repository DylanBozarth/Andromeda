import './styles/global.css';
import { useState } from 'react';
import { SectorA } from './views/sectors/sectora';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { UImaster } from './UI/user-interface-master';
import { SystemView } from './views/system-view';
import { GalaticView } from './views/galatic-view';

function App() {
  /* controlling player location */
  /* const [playerSector, setPlayerSector] = useState<Object>() */
  const [playerSystem, setPlayerSystem] = useState({});
  const props = { playerSystem, setPlayerSystem };
  return (
    <BrowserRouter>
      <UImaster />

      <Routes>
        <Route path='/' element={<GalaticView />} />
        <Route path='/sectora' element={<SectorA {...props} />} />
        <Route path='/system/:systemName' element={<SystemView {...props} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
