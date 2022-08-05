import styles from '../styles/user-interface-master.module.css';
import { useState } from 'react';
import { MainMenu } from './menu-pages/mainMenu';
import { Research } from './menu-pages/research';
import { ResourceMenu } from './menu-pages/resources';
import { FleetManagement } from './menu-pages/fleetManagement';
export const TopBar = () => {
    const [openMenu, setOpenMenu] = useState(0);
    return (
        <div>
            <div className={styles['sci-fi-thing']}></div>
            <div className={styles['top-bar-wrapper']}>
                <div className={styles['top-nav-button-base']}>
                    <button className={styles['top-nav-1']} onClick={() => openMenu === 1 ? setOpenMenu(0) : setOpenMenu(1)}>menu</button>
                </div>
                <div className={styles['top-nav-button-base']}>
                    <button className={styles['top-nav-1']}  onClick={() => openMenu === 1 ? setOpenMenu(0) : setOpenMenu(2)}>Research</button>
                </div>
                <div className={styles['top-nav-button-base']}>
                    <button className={styles['top-nav-1']}  onClick={() => openMenu === 1 ? setOpenMenu(0) : setOpenMenu(3)}>Fleets</button>
                </div>
                <div className={styles['top-nav-button-base']}>
                    <button className={styles['top-nav-1']}  onClick={() => openMenu === 1 ? setOpenMenu(0) : setOpenMenu(4)}>Resources</button>
                </div>
            </div>
            <div className={openMenu === 1 ? 'take-whole-screen' : 'hidden'}>
                <MainMenu /></div>
            <div className={openMenu === 2 ? 'take-whole-screen' : 'hidden'}>
                <Research /></div>
            <div className={openMenu === 3 ? 'take-whole-screen' : 'hidden'}>
                <FleetManagement /></div>
            <div className={openMenu === 4 ? 'take-whole-screen' : 'hidden'}>
                <ResourceMenu /></div>

        </div>
    )
}