import '../../styles/user-interface-master.scss';
import { FleetFloatMenu } from '../float-menus/fleets';
import { useAppSelector } from '../../redux/hooks';
export const SystemSideBar = () => {

  const playerSystem = useAppSelector((state) => state.sector.activeSystem);
    return (
        <div className='side-bar-wrapper'>
 <div className='side-bar-background'></div>
            <div className='side-bar p-1'>
                <h3 className='text-center'>{playerSystem.systemName}</h3>
                <p className='text-center'>{playerSystem.systemPlanets.length} Planets</p>
                
                <FleetFloatMenu />
            </div>
            
        </div>
    );
};
/* MAKE THIS DYNAMIC */