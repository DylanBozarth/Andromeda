import styles from '../styles/user-interface-master.module.css';
export const TopBar = () => {
    return (
        <div>
        <div className={styles['sci-fi-thing']}></div>
        <div className={styles['top-bar-wrapper']}>
            <div className={styles['top-nav-button-base']}>
                <button className={`${styles['top-nav-1']} ${styles['ui-border-box']}`}>menu</button>
                </div>
                <div className={styles['top-nav-button-base']}>
                <button className={`${styles['top-nav-1']} ${styles['ui-border-box']}`}>Research</button>
                </div>
                <div className={styles['top-nav-button-base']}>
                <button className={`${styles['top-nav-1']} ${styles['ui-border-box']}`}>Fleets</button>
                </div>
                <div className={styles['top-nav-button-base']}>
                <button className={`${styles['top-nav-1']} ${styles['ui-border-box']}`}>Resources</button>
                </div>
        </div>
    </div>
    )
}