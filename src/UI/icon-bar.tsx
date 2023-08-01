import '../styles/user-interface-master.scss'
import { useState } from 'react';
import { AlertsPopupMenu } from './icon-menu-pop-ups/alerts';
import { ResourcePopupMenu } from './icon-menu-pop-ups/resources';
import { FleetsPopupMenu } from './icon-menu-pop-ups/fleets';
import { PlanetManagerPopUpMenu } from './icon-menu-pop-ups/planet-manager';
import { ResearchPopUpMenu } from './icon-menu-pop-ups/research';
import { FactionsPopUpMenu } from './icon-menu-pop-ups/factions';
import { ExplorePopUpMenu } from './icon-menu-pop-ups/exploration';
export const IconBar = () => {
    const [openMenu, setOpenMenu] = useState('none');
    return (
        <div className='top-layer-menu'>
            <div className='fixed bottom-0 icon-bar '>
                <div className='flex justify-center'>
                    <div className='ui-border-box' onClick={() => (openMenu === 'alerts' ? setOpenMenu('none') : setOpenMenu('alerts'))}>
                        <img src='../assets/alerts.png' height='50px' width='50px'></img> Alerts
                    </div>
                    {/*
                    <div className='ui-border-box' onClick={() => (openMenu === 'planetManager' ? setOpenMenu('none') : setOpenMenu('planetManager'))}>
                        <img src='../assets/sample-image.png' height='50px' width='50px'></img>Planet Manager
                    </div>
                    <div className='ui-border-box' onClick={() => (openMenu === 'research' ? setOpenMenu('none') : setOpenMenu('research'))}>
                        <img src='../assets/sample-image.png' height='50px' width='50px'></img>Research
                    </div>*/}
                    <div className='ui-border-box' onClick={() => (openMenu === 'factions' ? setOpenMenu('none') : setOpenMenu('factions'))}>
                        <img src='../assets/sample-image.png' height='50px' width='50px'></img>Factions
                    </div>
                    <div className='ui-border-box' onClick={() => (openMenu === 'exploration' ? setOpenMenu('none') : setOpenMenu('exploration'))}>
                        <img src='../assets/sample-image.png' height='50px' width='50px'></img>Exploration
                    </div>
                </div>
            </div>
            <div className='top-layer-menu m-10 fixed'>
                {/* pop up menus, im sure there's a way to do this DRY style but I cant be bothered to find it. */}
                <div className={openMenu === 'alerts' ? '' : 'hidden'}>
                    <div className=''>
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
            </div>
        </div>
    )
}