import '../styles/user-interface-master.scss'
import { useState } from 'react';
import { MilitaryMenu } from './icon-menu-pop-ups/military/military-menu';
import { EconomyMenu } from './icon-menu-pop-ups/economy/economy-menu';
import { ScienceMenu } from './icon-menu-pop-ups/science/science-menu';
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
            <div className='middle-layer-menu m-10 fixed'>
                <div className={openMenu === 'military' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <MilitaryMenu />
                    </div>
                </div>
                <div className={openMenu === 'economy' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <EconomyMenu />
                    </div>
                </div>
                <div className={openMenu === 'science' ? '' : 'hidden'}>
                    <div className='pop-up-menu'>
                        <ScienceMenu />
                    </div>
                </div>
            </div>
        </div>
    )
}