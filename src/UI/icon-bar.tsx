import '../styles/user-interface-master.scss'
import { useState } from 'react';
import { AlertsPopupMenu } from './icon-pop-ups/alerts';
import { ResourcePopupMenu } from './icon-pop-ups/resources';
import { FleetsPopupMenu } from './icon-pop-ups/fleets';
import { PlanetManagerPopUpMenu } from './icon-pop-ups/planet-manager';
import { ResearchPopUpMenu } from './icon-pop-ups/research';
import { FactionsPopUpMenu } from './icon-pop-ups/factions';
import { ExplorePopUpMenu } from './icon-pop-ups/exploration';
export const IconBar = () => {
    const [openMenu, setOpenMenu] = useState('none');
    return (
        <div className='grid z-99 icon-bar'>
            <div className='flex bottom-0 fixed text-center place-self-center'>
                <div className='ui-border-box' onClick={() => (openMenu === 'fleets' ? setOpenMenu('none') : setOpenMenu('fleets'))}>
                    <img src='../assets/ship-icon.jpeg' height='50px' width='50px'></img> Fleets
                </div>
                
                <div className='ui-border-box ' onClick={() => (openMenu === 'alerts' ? setOpenMenu('none') : setOpenMenu('alerts'))}>
                    <img src='../assets/alerts.png' height='50px' width='50px'></img> Alerts
                </div>
                <div className='ui-border-box' onClick={() => (openMenu === 'planetManager' ? setOpenMenu('none') : setOpenMenu('planetManager'))}>
                    <img src='../assets/sample-image.png' height='50px' width='50px'></img>Planet Manager
                </div>
                <div className='ui-border-box' onClick={() => (openMenu === 'research' ? setOpenMenu('none') : setOpenMenu('research'))}>
                    <img src='../assets/sample-image.png' height='50px' width='50px'></img>Research
                </div>
                <div className='ui-border-box' onClick={() => (openMenu === 'factions' ? setOpenMenu('none') : setOpenMenu('factions'))}>
                    <img src='../assets/sample-image.png' height='50px' width='50px'></img>Factions
                </div>
                <div className='ui-border-box' onClick={() => (openMenu === 'resources' ? setOpenMenu('none') : setOpenMenu('resources'))}>
                    <img src='../assets/resource-icon.png' height='50px' width='50px'></img> Resources
                </div>
                <div className='ui-border-box' onClick={() => (openMenu === 'exploration' ? setOpenMenu('none') : setOpenMenu('exploration'))}>
                    <img src='../assets/sample-image.png' height='50px' width='50px'></img>Exploration
                </div>

            </div>
            <div>
                {/* pop up menus, there's a way to do this DRY style but I cant be bothered to find it. */}
                <div className={openMenu === 'fleets' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <FleetsPopupMenu />
                    </div>
                </div>
                <div className={openMenu === 'resources' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <ResourcePopupMenu />
                    </div>
                </div>
                <div className={openMenu === 'alerts' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <AlertsPopupMenu />
                    </div>
                </div>
                <div className={openMenu === 'planetManager' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <PlanetManagerPopUpMenu />
                    </div>
                </div>
                <div className={openMenu === 'research' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <ResearchPopUpMenu />
                    </div>
                </div>
                <div className={openMenu === 'factions' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <FactionsPopUpMenu />
                    </div>
                </div>
                <div className={openMenu === 'exploration' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <ExplorePopUpMenu />
                    </div>
                </div>
                {/* if we need more 
                <div className={openMenu === 8 ? '' : 'hidden'}>
                    FORTH THING
                </div>
                <div className={openMenu === 9 ? '' : 'hidden'}>
                    FORTH THING
                </div>
                <div className={openMenu === 10 ? '' : 'hidden'}>
                    FORTH THING
                </div>*/}
            </div>
        </div>
    )
}