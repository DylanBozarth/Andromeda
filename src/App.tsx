import '@styles/global.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { SystemView } from './views/system/system-view';

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <div className='background-class' />
        <Routes>
          <Route path='/' element={<SystemView />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
