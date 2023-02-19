import './styles/global.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UImaster } from './UI/user-interface-master';
import { SystemView } from './views/system-view';
import { GalaticView } from './views/galatic-view';
import { SectorA } from './views/sectors/sector-a';
import { DetailsMenu } from './UI/menu-pages/detailsMenu';
import { useEffect } from 'react';
import { getAvailableBuildings } from './clientLibrary/buildings';
// import Login from './components/Authenication/login';
// import Register from './components/Authenication/register';

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const response = await getAvailableBuildings();
      console.log(response);
    };
    fetchData();
  }, []);
  return (
    <BrowserRouter>
      <div className='background-class'></div>
      <UImaster />
      <Routes>
        <Route path='/' element={<GalaticView />} />
        <Route path='/sector-a' element={<SectorA />} />
        <Route path='/system/:systemName' element={<SystemView />} />
        <Route path='/menu' element={<DetailsMenu />} />
        {/* <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
