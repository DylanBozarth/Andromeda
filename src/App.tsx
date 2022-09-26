
import './styles/global.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { UImaster } from './UI/user-interface-master';
import { SystemView } from './views/system-view';
import { GalaticView } from './views/galatic-view';
import { SectorA } from './views/sectors/sector-a';
import { DetailsMenu } from './UI/menu-pages/detailsMenu';

function App() {
  return (
    <BrowserRouter>
      <UImaster />
      <Routes>
        <Route path='/' element={<GalaticView />} />
        <Route path='/sector-a' element={<SectorA />} />
        <Route path='/system/:systemName' element={<SystemView />} />
        <Route path='/menu' element={<DetailsMenu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;