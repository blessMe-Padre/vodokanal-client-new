import { Breadcrumbs } from "@/app/components";

import ContentPage from "./ContentPage";
import styles from "./style.module.scss";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Пользовательское соглашение',
    description: 'Пользовательское соглашение МУП "Находка-Водоканал"',
}

export default function TermsOfService() {
    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Передача показаний через сайт"/>                
               <ContentPage />
            </div>
        </section>
    )
}