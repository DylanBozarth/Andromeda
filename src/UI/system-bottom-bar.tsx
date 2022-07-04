import styles from '../styles/user-interface-master.module.css'
import { System } from '../utils/system-generator/generate-sector';
interface systemInformation {
    playerSystem: System;
}

export const SystemBottomBar = ({ playerSystem }: systemInformation) => {
    return (
        <div>
            <div className={styles['system-bottom-bar']}>

                <div className={styles['bottom-bar-section']}>System Power
                    <br /> Hangar 700<br /> Planetary defenses 3000</div>

            </div>

        </div>
    )
}