import '../../styles/user-interface-master.scss';
import { Planet } from '../../types/planet-interface';
import { useState } from 'react';
import { FleetFloatMenu } from '../float-menus/fleets';

interface toggles {
    playerPlanet: Planet;
    toggleResources: boolean;
    toggleBuildings: boolean;
    setToggleResources: (flag: boolean) => void;
    setToggleBuildings: (flag: boolean) => void;
}
export const PlanetSideBar = ({
    playerPlanet,
    toggleBuildings,
    toggleResources,
    setToggleBuildings,
    setToggleResources
}: toggles) => {
    const [tabNumber, setTabNumber] = useState(1);
    return (
        <div className='middle-layer-menu'>
            <div className='side-bar p-1 ui-white-box'>
                <h3 className='text-center'>{playerPlanet.name}</h3>
                <p className='text-center'>Owned by: {playerPlanet.ownership}</p>
                <div className='side-bar-background'></div>
                {/* tabs */}
                <div className='flex justify-center'>
                    <div className='p-1' onClick={() => setTabNumber(1)}>
                        Production
                    </div>
                    <div className='p-1' onClick={() => setTabNumber(2)}>
                        Hangar
                    </div>
                    <div className='p-1' onClick={() => setTabNumber(3)}>
                        Resources
                    </div>
                </div>
                <div className='side-screen p-1'>
                    <div className={tabNumber === 1 ? 'side-tab-info' : 'hidden'}>
                        <div className='m-2 text-center border-2 flex'><p className='p-2'>ICON</p><p className='p-2'>A building is building on planet X</p></div>
                    </div>
                    <div className={tabNumber === 2 ? 'side-tab-info' : 'hidden'}>
                        <div className='m-2 text-center border-2 flex'><p className='p-2'>Status</p><p className='p-2'>SHIP</p></div>
                    </div>
                    <div className={tabNumber === 3 ? 'side-tab-info' : 'hidden'}>
                        <div className='m-2 text-center border-2 flex'><p className='p-2'>Like 6 rocks</p></div>
                    </div>
                </div>
                <div className='flex p-1 justify-center'>
                    <div onClick={() => setToggleBuildings(!toggleBuildings)} className='ui-border-box'>Buildings</div>
                    <div onClick={() => setToggleResources(!toggleResources)} className='ui-border-box'>Desposits</div>
                </div>
                <FleetFloatMenu />
            </div>
            
        </div>
    );
};