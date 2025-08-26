import { Breadcrumbs } from "@/app/components";
import ContentRenderer, { ContentItem } from "@/app/components/ContentRenderer/ContentRenderer";
import fetchData from "@/app/utils/fetchData";

import styles from "./style.module.scss";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Реквизиты',
    description: 'Реквизиты МУП "Находка-Водоканал"',
}

interface ApiResponse {
    data: {
        id: number;
        content?: ContentItem[];
    };
}

export default async function Requisites() {
    const page = await fetchData<ApiResponse>(`/api/stranicza-rekvizity?populate=*`);

    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Реквизиты" />
                <h1 className='title'>Реквизиты</h1>
                <div className={styles.content}>

                    {page?.data?.content && (
                        <ContentRenderer content={page.data.content} />
                    )}
                </div>
            </div>
        </section>
    )
} 