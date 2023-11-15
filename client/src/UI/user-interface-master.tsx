import { IconBar } from './icon-bar';
import { NavigationBar } from './navigation-bar';
import { generateSector } from '../utils/system-generator/generate-sector';
export const UImaster: React.FC = () => {
  // const sector = generateSector(10, 8);
  return (
    <div className=''>
      <NavigationBar />
      <IconBar />
      {/* Uncomment all of this out if you need to generate a new sector */}
      <a href='#' onClick={() => generateSector(10, 8)} className=' z-99 fixed mt-20'>
        Generate new sector (debug)
      </a>  
    </div>
  );
};
