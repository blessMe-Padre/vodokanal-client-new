import { Breadcrumbs } from "@/app/components";

import styles from "./style.module.scss";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Прочие заявления',
    description: 'Прочие заявления МУП "Находка-Водоканал"',
}

export default async function page() {
    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs
                    secondLabel="Подключение к сетям"
                    secondLink='/connection'
                    thirdLabel="Прочие заявления"
                />
                <h1 className='title'>Прочие заявления</h1>

            </div>
        </section>
    )
} 