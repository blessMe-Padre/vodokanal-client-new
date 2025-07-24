import { Cookies } from "@/app/components";
import styles from "./style.module.scss";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <h1>МУП Находка-Водоканал - footer</h1>
            </div>
            <Cookies />
        </footer>
    )
}