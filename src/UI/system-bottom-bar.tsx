import styles from '../styles/user-interface-master.module.css'
import { useEffect } from 'react';
import { System } from '../utils/system-generator/generate-sector';
interface systemInformation {
    playerSystem: System;
}

export const SystemBottomBar = ({ playerSystem }: systemInformation) => {
    useEffect(() => {
        console.log('from the bar', playerSystem)
    }, [])
    return (
        <div><h4 className={styles['system-title']}>{playerSystem.systemName}, {playerSystem.systemStar} system. <br />
        {playerSystem.ownership !== 'unowned' ? `${playerSystem.ownership}'s system` : 'Unclaimed System'}</h4>
        <div className={styles['system-bottom-bar']}>

        </div>
        </div>
    )
}