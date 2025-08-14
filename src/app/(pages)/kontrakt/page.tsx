import { Breadcrumbs } from "@/app/components";
import ContentRenderer from "@/app/components/ContentRenderer/ContentRenderer";
import fetchData from "@/app/utils/fetchData";

import styles from './styles.module.scss'

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Заключи контракт на службу',
    description: 'Заключи контракт на службу -  МУП "Находка-Водоканал"',
}

export default async function Page() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = await fetchData(`/api/stranicza-kontrakt?populate=*`) as any;

    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Заключи контракт на службу" />
                <h1 className='title'>Заключи контракт на службу</h1>

                <ContentRenderer content={page?.data?.content} />

            </div>
        </section>
    )
}