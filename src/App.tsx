import './styles/global.css';
import { useState, useEffect } from 'react';
import { SectorView } from './views/sector-view';
import { Route, Routes, useLocation } from "react-router-dom";
import { UImaster } from './UI/user-interface-master';
import { BrowserRouter } from "react-router-dom";
import { SystemView } from './views/system-view';

function App() {
  /* controlling player location */
  /*const [playerSector, setPlayerSector] = useState<Object>() */
  const [playerSystem, setPlayerSystem] = useState<Object>({})
  const props = { playerSystem, setPlayerSystem }
  return (
    <BrowserRouter>
      <UImaster  />
    
      <Routes>
        <Route path="/sectora" element={<SectorView {...props}  /> } />
        <Route path="/system/:systemName" element={<SystemView {...props}  />}  />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
