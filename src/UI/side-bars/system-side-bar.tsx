import '../../styles/user-interface-master.scss';
import { FleetFloatMenu } from '../float-menus/fleets';
import { useAppSelector } from '../../redux/hooks';
export const SystemSideBar = () => {

  const playerSystem = useAppSelector((state) => state.sector.activeSystem);
  const goToOrbitalView = () => {
    window.location.href = window.location.href + '/orbital'
  }
    return (
        <div className='middle-layer-menu'>
 <div className='side-bar-background'></div>

            <div className='side-bar p-1  ui-white-box p-2'>
                 <button onClick={() => goToOrbitalView()}>Orbital view</button>
                <h3 className='text-center'>{playerSystem.systemName}</h3>
                <h5 className='text-center'>{playerSystem.systemStar} star</h5>
                <p className='text-center'>{playerSystem.systemPlanets.length} Planets</p>
                
            </div>
            
        </div>
    );
};