import { Breadcrumbs } from "@/app/components";
import ContentRenderer from "@/app/components/ContentRenderer/ContentRenderer";
import fetchData from "@/app/utils/fetchData";

import styles from "./style.module.scss";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Пользовательское соглашение',
    description: 'Пользовательское соглашение МУП "Находка-Водоканал"',
}

export default async function TermsOfService() {
    const page = await fetchData(`/api/stranicza-polzovatelskoe-soglashenie?populate=*`);

    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Пользовательское соглашение" />
                <h1 className='title'>Пользовательское соглашение</h1>

                <ContentRenderer content={page?.data?.content} />
            </div>
        </section>
    )
}