import '../styles/user-interface-master.scss'
import { useState } from 'react';
import { AlertsPopupMenu } from './icon-menu-pop-ups/military/alerts';
import { ResourcePopupMenu } from './icon-menu-pop-ups/economy/resources';
import { FleetsPopupMenu } from './icon-menu-pop-ups/military/fleets';
import { PlanetManagerPopUpMenu } from './icon-menu-pop-ups/economy/planet-manager';
import { ResearchPopUpMenu } from './icon-menu-pop-ups/science/research';
import { FactionsPopUpMenu } from './icon-menu-pop-ups/science/factions';
import { ExplorePopUpMenu } from './icon-menu-pop-ups/science/exploration';
import { MilitaryMenu } from './icon-menu-pop-ups/military/military-menu';
export const IconBar = () => {
    const [openMenu, setOpenMenu] = useState('none');
    return (
        <div className='top-layer-menu'> {/* do not consolidate classes here, as they will apply to the pop up menus too */}
            <div className='icon-bar fixed bottom-0'>
                <div className='flex justify-center'>
                    <div className='ui-border-box p-3' onClick={() => (openMenu === 'military' ? setOpenMenu('none') : setOpenMenu('military'))}>
                        <div className='icon-bar-military-icon p-4'></div>
                        <p className='icon-bar-text'>Military</p>
                    </div>
                    <div className='ui-border-box p-3' onClick={() => (openMenu === 'economy' ? setOpenMenu('none') : setOpenMenu('economy'))}>
                        <div className='icon-bar-economy-icon p-4'></div>
                        <p className='icon-bar-text'>Economy</p>
                    </div>
                    <div className='ui-border-box p-3' onClick={() => (openMenu === 'science' ? setOpenMenu('none') : setOpenMenu('science'))}>
                        <div className='icon-bar-science-icon p-4'></div>
                        <p className='icon-bar-text'>Science</p>
                    </div>
                </div>
            </div>
            <div className='top-layer-menu m-10 fixed'>
                {/* pop up menus, im sure there's a way to do this DRY style but I cant be bothered to find it. */}
                <div className={openMenu === 'military' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <MilitaryMenu />
                    </div>
                </div>
                <div className={openMenu === 'economy' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <PlanetManagerPopUpMenu />
                    </div>
                </div>
                <div className={openMenu === 'science' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <ResearchPopUpMenu />
                    </div>
                </div>
            </div>
        </div>
    )
}