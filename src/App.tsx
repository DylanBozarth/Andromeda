import './styles/global.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { UImaster } from './UI/user-interface-master';
import { SystemView } from './views/system-view';
import { GalaticView } from './views/galatic-view';
import { SectorA } from './views/sectors/sector-a';
import { DetailsMenu } from './UI/menu-pages/detailsMenu';
import Login from './components/Authenication/login';
import Register from './components/Authenication/register';
import { MyComponent } from '@andromeda-packages/component-library-react';

function App() {
  return (
    <BrowserRouter>
      <div className='background-class'></div>
      <UImaster />
      <Routes>
        <Route path='/' element={<GalaticView />} />
        <Route path='/sector-a' element={<SectorA />} />
        <Route path='/system/:systemName' element={<SystemView />} />
        <Route path='/menu' element={<DetailsMenu />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      {/* TESTING PURPOSES ONLY */}
      <MyComponent first='Test' last='MyComponent'></MyComponent>
      {/* TESTING PURPOSES ONLY */}
    </BrowserRouter>
  );
}

export default App;
