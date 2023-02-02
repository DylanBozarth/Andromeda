import UIstyles from '../styles/user-interface-master.module.scss'
import { useState } from 'react';
import { AlertsPopupMenu } from './icon-pop-ups/alerts';
import { ResourcePopupMenu } from './icon-pop-ups/resources';
import { ShipsPopupMenu } from './icon-pop-ups/ships';
export const IconBar = () => {
    const [openMenu, setOpenMenu] = useState(0);
    return (
        <div>
            <div className={UIstyles['ui-border-box']} onClick={() => (openMenu === 1 ? setOpenMenu(0) : setOpenMenu(1))}>
                <img src='./assets/ship-icon.jpeg' height='50px' width='50px'></img></div>
            <div className={UIstyles['ui-border-box']} onClick={() => (openMenu === 1 ? setOpenMenu(0) : setOpenMenu(2))}>
                <img src='./assets/resource-icon.png' height='50px' width='50px'></img></div>


            {/* pop up menus */}
            <div className={openMenu === 1 ? 'pop-up' : 'hidden'}><ShipsPopupMenu /></div>
            <div className={openMenu === 2 ? 'pop-up' : 'hidden'}>
                <AlertsPopupMenu />
            </div>
            <div className={openMenu === 3 ? 'pop-up' : 'hidden'}>
                <ResourcePopupMenu />
            </div>
        </div>
    )
}