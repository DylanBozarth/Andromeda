import '../styles/user-interface-master.scss';
import { Planet } from '../types/planet-interface';
import { useState } from 'react';
import { AvailableBuildings } from './buildings/AvailableBuildings';
interface planetInformation {
    playerPlanet: Planet;
}
interface toggles {
    toggleResources: boolean;
    toggleBuildings: boolean;
    setToggleResources: (flag: boolean) => void;
    setToggleBuildings: (flag: boolean) => void;
}
export const PlanetSideBar = ({
    playerPlanet
}: planetInformation) => {
    const [expanded, setExpanded] = useState(true);
    const [tabNumber, setTabNumber] = useState(1);
    return (
        <div className='side-bar-wrapper'>
            <div onClick={() => setExpanded(!expanded)} className='ui-border-box toggle-side-bar'>
                Toggle UI
            </div>
            <div className={expanded ? 'side-bar' : 'hidden'}>
                <div className='side-bar-background-wrapper'>
                    <div className='side-bar-background'></div>
                </div>
                <div className='side-tab-row m-2 text-center'>
                    <div className='side-tab' onClick={() => setTabNumber(1)}>
                        Production
                    </div>
                    <div className='side-tab' onClick={() => setTabNumber(2)}>
                        Hangar
                    </div>
                    
                </div>

                <div className='side-screen'>
                    <div className={tabNumber === 1 ? 'side-tab-info' : 'hidden'}>
                        <div className='m-2 text-center border-2 flex'><p className='p-2'>ICON</p><p className='p-2'>A building is building on planet X</p></div>
                    </div>
                    <div className={tabNumber === 2 ? 'side-tab-info' : 'hidden'}>
                        <div className='m-2 text-center border-2 flex'><p className='p-2'>Status</p><p className='p-2'>SHIP</p></div>
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    );
};