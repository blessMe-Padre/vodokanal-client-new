import { Breadcrumbs } from "@/app/components";

import PageContent from "./PageContent";
import styles from "./style.module.scss";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Заявление на заключение договора на доключение к сетям',
    description: 'Заявление на заключение договора на доключение к сетям МУП "Находка-Водоканал"',
}

export default async function page() {
    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs
                    secondLabel="Подключение к сетям"
                    secondLink='/connection'
                    thirdLabel="Заявление на заключение договора
на доключение к сетям"
                />
                <h1 className='title'>Заявление на заключение договора
                    на доключение к сетям</h1>
                
                <PageContent />


            </div>
        </section>
    )
} 