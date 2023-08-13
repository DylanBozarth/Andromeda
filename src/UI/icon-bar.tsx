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
        <div className='top-layer-menu'> {/* do not consolidate classes here, as they will apply to the pop up menus too */}
            <div className='icon-bar fixed bottom-0'>
                <div className='flex justify-center'>
                    <div className='ui-border-box ' onClick={() => (openMenu === 'military' ? setOpenMenu('none') : setOpenMenu('military'))}>
                        <div className='icon-bar-military-icon p-4 icon-bar-text'>Military</div>
                    </div>
                    <div className='ui-border-box' onClick={() => (openMenu === 'economy' ? setOpenMenu('none') : setOpenMenu('economy'))}>
                        <div className='icon-bar-economy-icon p-4 icon-bar-text'>Economy</div>
                    </div>
                    <div className='ui-border-box' onClick={() => (openMenu === 'science' ? setOpenMenu('none') : setOpenMenu('science'))}>
                        <div className='icon-bar-science-icon p-4 icon-bar-text'>Science</div>
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
                <div className={openMenu === 'fleets' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <FleetsPopupMenu />
                    </div>
                </div>
            </div>
        </div>
    )
}