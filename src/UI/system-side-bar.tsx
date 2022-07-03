import styles from '../styles/user-interface-master.module.css'
import { System } from '../utils/system-generator/generate-sector';
import { useState } from 'react';
interface systemInformation {
    playerSystem: System;
}
export const SystemSideBar = ({ playerSystem }: systemInformation) => {
    const [expanded, setExpanded] = useState(true);
    return (
        <div className={styles['side-bar-wrapper']}>
            <div onClick={() => setExpanded(!expanded)} className={styles['toggle-side-bar']}>Toggle</div>
            <div className={expanded ? styles['side-bar'] : 'hidden'}>
                <div className={styles['side-tab-row']}>
                    <div className={styles['side-tab']}>Buildings</div><div className={styles['side-tab']}>Production</div><div className={styles['side-tab']}>Alerts</div></div>
                <div className={styles['side-screen']}>Data will be displayed here
                    <br /> Buildings will show buildings available to build, <br /> production will show ships/probes whatever that is building or can be put into a Q.
                    <br /> Alerts will show enemy fleets heading towards you, threats on planets or things that will need to be addressed.
                </div>
            </div>
        </div>
    )
}
/* future plans
<h4 className={styles['system-title']}>{playerSystem.systemName}, {playerSystem.systemStar} system. <br />
        {playerSystem.ownership !== 'unowned' ? `${playerSystem.ownership}'s system` : 'Unclaimed System'}</h4>
        */