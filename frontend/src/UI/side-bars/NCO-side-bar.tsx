import '../../styles/user-interface-master.scss';
import { FleetFloatMenu } from '../float-menus/fleets';
import { useAppSelector } from '../../redux/hooks';
export const NCOSideBar = () => {
    const playerNCO = useAppSelector((state) => state.sector.activeNCO);
    return (
        <div className='middle-layer-menu'>
 <div className='side-bar-background'></div>
            <div className='side-bar p-1  ui-white-box p-2'>
                <h3 className='text-center'>{playerNCO.type}</h3>
                <p className='text-center'>{playerNCO.effect} on all fleets in system</p>
                
                <FleetFloatMenu />
            </div>
            
        </div>
    );
};