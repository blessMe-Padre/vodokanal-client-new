import styles from "./style.module.scss";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className="container">
                <h1>МУП Находка-Водоканал - header</h1>
            </div>
        </header>
    )
}