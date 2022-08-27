import { useSystems } from '../utils/system-generator/redux-hook';
import { TopBar } from './top-bar';
import { NavigationBar } from './navigation-bar';
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

      <NavigationBar />
    </div>
  );
};
