import './styles/global.css';
import {useState, useEffect} from 'react';
import {SectorView } from './views/sector-view';
import { Route, useLocation } from "react-router-dom";
import { UImaster } from './UI/user-interface-master';
function App() {
  /* controlling player location */
  const [playerSector, setPlayerSector] = useState(null);
  const [playerSystem, setPlayerSystem] = useState(null);
  const location = useLocation();
  return (
    <div className="App">
     UNIVERS... agaain
     <UImaster />
     {/*<Route exact path="/sectora" component={SectorView} /> */}
    </div>
  );
}

export default App;
