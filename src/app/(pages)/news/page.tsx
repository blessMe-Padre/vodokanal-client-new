import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";

import PageContent from "./PageContent";
import styles from "./style.module.scss";

export const metadata = {

    title: 'МУП "Находка-Водоканал" - Новости',
    description: 'Новости компании',
}

export default function News() {
    return (
        <div className="container">
            <div className={styles.news}>
                <h1>Все новости</h1>
                <Breadcrumbs thirdLabel="Новости" />
                <PageContent />
            </div>
        </div>
    )
}