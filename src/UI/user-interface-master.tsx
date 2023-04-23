import { useSystems } from '../utils/system-generator/redux-hook';
import { IconBar } from './icon-bar';
import { NavigationBar } from './navigation-bar';
export const UImaster: React.FC = () => {
  const generateSystems = useSystems(10, 8);
  return (
    <div>
      <IconBar />
      <NavigationBar />
      <li>
        <a href='#' onClick={() => generateSystems()}>
          Generate new sector
        </a>
      </li>
    </div>
  );
};
