import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";

import PageContent from "./PageContent";
import styles from "./style.module.scss";

// TODO: уточнить по поводу фильтрафии новостей

export const metadata = {

    title: 'МУП "Находка-Водоканал" - Новости',
    description: 'Новости компании',
}

export default function News() {
    return (
        <div className="container">
            <div className={styles.news}>
                <Breadcrumbs thirdLabel="Новости" />
                <h1 className={styles.title}>Новости</h1>
                <PageContent />
            </div>
        </div>
    )
}