import '../../styles/user-interface-master.scss';
import { FleetFloatMenu } from '../float-menus/fleets';
import { useAppSelector } from '../../redux/hooks';
export const SystemSideBar = () => {

  const playerSystem = useAppSelector((state) => state.sector.activeSystem);
    return (
        <div className='side-bar-wrapper'>
            
            
            <div className='side-bar'><div className='side-bar-background'></div>
                <h3 className='text-center'>{playerSystem.systemName} System, {playerSystem.systemPlanets.length} planets</h3>
                
                
                <FleetFloatMenu />
            </div>
            
        </div>
    );
};