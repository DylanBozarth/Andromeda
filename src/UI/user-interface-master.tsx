import { IconBar } from './icon-bar';
import { NavigationBar } from './navigation-bar';
export const UImaster: React.FC = () => {
  return (
    <div>
      <NavigationBar />
      <IconBar />

      {/* for debug <a href='#' onClick={() => generateSystems()} className=' z-99 fixed mt-20'>
          Generate new sector (debug)
  </a> */}
    </div>
  );
};
