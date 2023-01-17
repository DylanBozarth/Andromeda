import { useSystems } from '../utils/system-generator/redux-hook';
import { TopBar } from './top-bar';
import { NavigationBar } from './navigation-bar';
import '../styles/tailwind.css'
export const UImaster: React.FC = () => {
  const generateSystems = useSystems(10, 8);
  return (
    <div>
      <TopBar />
      <li>
        <a href='#' onClick={() => generateSystems()}>
          Generate new sector
        </a>
      </li>
      <h1 className='text-3xl font-bold underline'>Tailwind test</h1>
      <NavigationBar />
    </div>
  );
};
