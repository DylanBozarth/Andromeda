import './styles/global.css';
import { useState } from 'react';
import { SectorA } from './views/sectors/sectora/sectora';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { UImaster } from './UI/user-interface-master';
import { SystemView } from './views/system-view';
import { GalaticView } from './views/galatic-view';
import { PlayerSystem } from './types/system-interfaces';

function App() {
  /* controlling player location */
  /* const [playerSector, setPlayerSector] = useState<Object>() */
  const [playerSystem, setPlayerSystem] = useState<PlayerSystem>({} as PlayerSystem);
  const props = { playerSystem, setPlayerSystem };
  return (
    <BrowserRouter>
      <UImaster />
      <Routes>
<<<<<<< HEAD
        
=======
>>>>>>> main
        <Route path='/' element={<GalaticView />} />
        <Route path='/sectora' element={<SectorA {...props} />} />
        <Route path='/system/:systemName' element={<SystemView {...props} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
