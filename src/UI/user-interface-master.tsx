import { useSystems } from '../utils/system-generator/redux-hook';
import { NavigationBar } from './navigation-bar';
export const UImaster: React.FC = () => {
  const generateSystems = useSystems(10, 8);
  return (
    <div>
      
      <NavigationBar />
      <li>
        <a href='#' onClick={() => generateSystems()}>
          Generate new sector
        </a>
      </li>
    </div>
  );
};
