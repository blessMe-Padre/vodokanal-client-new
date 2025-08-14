import { Breadcrumbs } from "@/app/components";
import ContentRenderer, { ContentItem } from "@/app/components/ContentRenderer/ContentRenderer";
import fetchData from "@/app/utils/fetchData";

import styles from "./style.module.scss";

interface ApiResponse {
    data: {
        id: number;
        attributes: {
            content?: ContentItem[];
        };
    };
}

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Политика конфиденциальности',
    description: 'Политика конфиденциальности МУП "Находка-Водоканал"',
}

export default async function PrivacyPolicy() {
    const page = await fetchData<ApiResponse>(`/api/stranicza-politika-konfidenczialnosti?populate=*`);

    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Политика конфиденциальности" />
                <h1 className='title'>Политика конфиденциальности</h1>

                {page?.data?.attributes?.content && (
                    <ContentRenderer content={page.data.attributes.content} />
                )}
            </div>
        </section>
    )
} 