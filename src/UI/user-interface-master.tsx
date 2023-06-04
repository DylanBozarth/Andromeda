import { useSystems } from '../utils/system-generator/redux-hook';
import { IconBar } from './icon-bar';
import { NavigationBar } from './navigation-bar';
export const UImaster: React.FC = () => {
  const generateSystems = useSystems(10, 8);
  return (
    <div>
      <NavigationBar />
      <IconBar />
      
        <a href='#' onClick={() => generateSystems()} className=' z-99 fixed mt-20'>
          Generate new sector (debug)
        </a>
    </div>
  );
};
