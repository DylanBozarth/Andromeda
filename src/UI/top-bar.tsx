import styles from '../styles/user-interface-master.module.css';
export const TopBar = () => {
    return (
        <div>
        <div className={styles['sci-fi-thing']}></div>
        <div className={styles['top-bar-wrapper']}>
            <div className={styles['top-nav-button-base']}>
                <button className={styles['top-nav-1']}>menu</button>
                </div>
                <div className={styles['top-nav-button-base']}>
                <button className={styles['top-nav-1']}>Research</button>
                </div>
                <div className={styles['top-nav-button-base']}>
                <button className={styles['top-nav-1']}>Fleets</button>
                </div>
                <div className={styles['top-nav-button-base']}>
                <button className={styles['top-nav-1']}>Resources</button>
                </div>
        </div>
    </div>
    )
}