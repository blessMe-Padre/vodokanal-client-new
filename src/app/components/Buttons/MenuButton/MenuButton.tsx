
import styles from "./style.module.scss";

const MenuButton = ({ onClick = () => {}, opened = false }) => {

    return (
        <button
            aria-label={opened ? 'Закрыть меню' : 'Открыть меню'}
            className={`${styles.button} ${opened ? styles.active : ''}`}
            onClick={onClick}
        >
            <div id="nav-icon1"
                className={`${styles.nav_icon1} ${opened ? styles.open : ''}`}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span>Меню</span>
        </button>
    )
}


export default MenuButton;