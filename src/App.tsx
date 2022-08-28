import './styles/global.css';
import { useState } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { UImaster } from './UI/user-interface-master';
import { SystemView } from './views/system-view';
import { GalaticView } from './views/galatic-view';
import { ReduxSector } from './views/sectors/sectora/redux-sector';
import { DetailsMenu } from './UI/menu-pages/detailsMenu'
import { System } from './utils/system-generator/generate-sector';

function App() {
  /* controlling player location */
  /* const [playerSector, setPlayerSector] = useState<Object>() */
  const [playerSystem, setPlayerSystem] = useState<System>({} as System);
  const props = { playerSystem, setPlayerSystem };
  return (
    <BrowserRouter>
      <UImaster />
      <Routes>
        <Route path='/' element={<GalaticView />} />
        <Route path='/redux-sector' element={<ReduxSector {...props} />} />
        <Route path='/system/:systemName' element={<SystemView {...props} />} />
        <Route path='/menu' element={<DetailsMenu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
