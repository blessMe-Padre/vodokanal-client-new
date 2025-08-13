import { Breadcrumbs } from "@/app/components";
import fetchData from "@/app/utils/fetchData";

import PageContent from "./PageContent";
import styles from "./style.module.scss";
import { AntiCorruptionResponse } from "./types";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Противодействие коррупции',
    description: 'Документы по противодействию коррупции в МУП "Находка-Водоканал"',
    keywords: 'Противодействие коррупции, МУП "Находка-Водоканал"',
    openGraph: {
        title: 'МУП "Находка-Водоканал" - Противодействие коррупции',
        description: 'Документы по противодействию коррупции в МУП "Находка-Водоканал"',
    }
}

const requestUrl = 
    "/api/stranicza-protivodejstvie-korrupczii?" +
    "populate[documents][populate][file][fields][0]=url" +
    "&populate[documents_2][populate][file][fields][0]=url" +
    "&populate[documents_3][populate][file][fields][0]=url" +
    "&populate[documents_4][populate][file][fields][0]=url" +
    "&populate[documents_5][populate][file][fields][0]=url"

    
    export default async function AntiCorruption() {
        const data: AntiCorruptionResponse = await fetchData(requestUrl);
        const pageData = data?.data;

        if (!pageData) {
            return (
                <section className={styles.section}>
                    <div className="container">
                        <Breadcrumbs secondLabel="Противодействие коррупции" />
                        <h1 className='title'>Противодействие коррупции</h1>
                        <p>ошибка при загрузке</p>
                    </div>
                </section>
            );
        }

    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Противодействие коррупции" />
                <h1 className='title'>Противодействие коррупции</h1>

                <PageContent pageData={pageData} />
 
            </div>
        </section>
    )
} 