import '../styles/user-interface-master.scss';
import { Planet } from '../types/planet-interface';
import { useState } from 'react';
import { AvailableBuildings } from './buildings/AvailableBuildings';

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
        <div className='side-bar-wrapper'>
 
            <div className='side-bar'>
                <h3 className='text-center'>{playerPlanet.name}</h3>
                <div className='side-bar-background-wrapper'>
                    <p className='text-center'>Owned by: {playerPlanet.ownership}</p>
                    <div className='side-bar-background'></div>
                </div>
                {/* tabs */}
                <div className='side-tab-row m-2 text-center'>
                    <div className='side-tab' onClick={() => setTabNumber(1)}>
                        Production
                    </div>
                    <div className='side-tab' onClick={() => setTabNumber(2)}>
                        Hangar
                    </div>
                    <div className='side-tab' onClick={() => setTabNumber(3)}>
                        Resources
                    </div>
                </div>
                <div className='side-screen'>
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
                <div className='flex p-1 '>
                    <div onClick={() => setToggleBuildings(!toggleBuildings)} className='ui-border-box'>Buildings</div>
                    <div onClick={() => setToggleResources(!toggleResources)} className='ui-border-box'>Desposits</div>
                </div>
                
            </div>
            
        </div>
    );
};