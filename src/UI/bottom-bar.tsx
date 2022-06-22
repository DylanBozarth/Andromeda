import styles from '../styles/user-interface-master.module.css';
import { Link } from 'react-router-dom';
export const BottomBar = () => {
    return (
        <div className={styles['bottom-bar']}>
            <div className={styles['bottom-bar-section']}>Galaxy</div>
            <div className={styles['bottom-bar-section']}>Sector</div>
            <div className={styles['bottom-bar-section']}>System</div>

            </div>
    )
}