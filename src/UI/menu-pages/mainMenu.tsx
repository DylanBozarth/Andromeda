import styles from '../../styles/menus/menu-master.css'
export const MainMenu = () => {
    return (
        <div className={styles['take-whole-screen']}>
            <div className={styles['main-menu-item']}>Profile</div>
            <div className={styles['main-menu-item']}>Friends</div>
            <div className={styles['main-menu-item']}>Forums</div>
            <div className={styles['main-menu-item']}>Other</div>
        </div>
    )
}