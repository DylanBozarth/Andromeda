import './styles/global.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { UImaster } from './UI/user-interface-master';
import { SystemView } from './views/system-view';
import { GalaticView } from './views/galatic-view';
import { ReduxSector } from './views/sectors/redux-sector/redux-sector';

function App() {
  return (
    <BrowserRouter>
      <UImaster />
      <Routes>
        <Route path='/' element={<GalaticView />} />
        <Route path='/redux-sector' element={<ReduxSector />} />
        <Route path='/system/:systemName' element={<SystemView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
