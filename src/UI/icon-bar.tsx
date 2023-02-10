import '../styles/user-interface-master.module.scss'
import { useState } from 'react';
import { AlertsPopupMenu } from './icon-pop-ups/alerts';
import { ResourcePopupMenu } from './icon-pop-ups/resources';
import { ShipsPopupMenu } from './icon-pop-ups/ships';
export const IconBar = () => {
    const [openMenu, setOpenMenu] = useState(0);
    return (
        <div className='flex'>
            <div>
                <div className='ui-border-box' onClick={() => (openMenu === 1 ? setOpenMenu(0) : setOpenMenu(1))}>
                    <img src='./assets/ship-icon.jpeg' height='50px' width='50px'></img>
                </div>
                <div className='ui-border-box' onClick={() => (openMenu === 2 ? setOpenMenu(0) : setOpenMenu(2))}>
                    <img src='./assets/resource-icon.png' height='50px' width='50px'></img>
                </div>
                <div className='ui-border-box' onClick={() => (openMenu === 3 ? setOpenMenu(0) : setOpenMenu(3))}>
                    <img src='./assets/alerts.png' height='50px' width='50px'></img>
                </div>
                <div className='ui-border-box' onClick={() => (openMenu === 4 ? setOpenMenu(0) : setOpenMenu(4))}>
                    <img src='./assets/sample-image.png' height='50px' width='50px'></img>
                </div>
            </div>
            <div>
                {/* pop up menus */}
                <div className={openMenu === 1 ? '' : 'hidden'}>
                    <ShipsPopupMenu />
                </div>
                <div className={openMenu === 2 ? '' : 'hidden'}>
                    <ResourcePopupMenu />
                </div>
                <div className={openMenu === 3 ? '' : 'hidden'}>
                    <AlertsPopupMenu />
                </div>
                <div className={openMenu === 4 ? '' : 'hidden'}>
                    FORTH THING
                </div>
            </div>
        </div>
    )
}