import styles from '../styles/user-interface-master.module.css'
import { System } from '../utils/system-generator/generate-sector';
import { useState } from 'react';
import { SystemPowerBar } from './system-power-bar';
interface systemInformation {
    playerSystem: System;
}
interface toggles {
    toggleResources: boolean;
    toggleBuildings: boolean;
    setToggleResources: any;
    setToggleBuildings: any;
}
export const SystemSideBar = ({ playerSystem, toggleBuildings, toggleResources, setToggleBuildings, setToggleResources }: systemInformation & toggles) => {
    const [expanded, setExpanded] = useState(true);
    const [tabNumber, setTabNumber] = useState(1)
    return (
        <div className={styles['side-bar-wrapper']}>

            <div onClick={() => setExpanded(!expanded)} className={`${styles['ui-border-box']} ${styles['toggle-side-bar']}`}>Toggle</div>
            <div className={expanded ? styles['side-bar'] : 'hidden'}>
                <div className={styles['side-bar-background-wrapper']}>
                    <div className={styles['side-bar-background']}></div>
                </div>
                <div className={styles['side-tab-row']}>
                    <div className={styles['side-tab']} onClick={() => setTabNumber(1)}>Buildings</div>
                    <div className={styles['side-tab']} onClick={() => setTabNumber(2)}>Hangar</div>
                    <div className={styles['side-tab']} onClick={() => setTabNumber(3)}>Alerts</div></div>
                <div className={styles['side-screen']}>
                    <div className={tabNumber === 1 ? `${styles['side-tab-info']}` : 'hidden'}>A building is building on planet X</div>
                    <div className={tabNumber === 2 ? `${styles['side-tab-info']}` : 'hidden'}>Production</div>
                    <div className={tabNumber === 3 ? `${styles['side-tab-info']}` : 'hidden'}>Alerts</div>
                </div>
                <SystemPowerBar playerSystem={playerSystem} toggleResources={toggleResources} toggleBuildings={toggleBuildings} setToggleResources={setToggleResources} setToggleBuildings={setToggleBuildings} />
            </div>
        </div>
    )
}
