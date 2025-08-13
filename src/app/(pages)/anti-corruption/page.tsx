import { Breadcrumbs } from "@/app/components";
import DocumentComponent from "@/app/components/DocumentComponent/DocumentComponent";
import fetchData from "@/app/utils/fetchData";

import styles from "./style.module.scss";

interface Document {
    title: string;
    link: string;
    file: {
        url: string;
    };
}

interface AntiCorruptionResponse {
    data: {
        title_1: string;
        title_2: string;
        title_3: string;
        title_4: string;
        title_5: string;
        documents: Document[];
        documents_2: Document[];
        documents_3: Document[];
        documents_4: Document[];
        documents_5: Document[];
    };
}

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Противодействие коррупции',
    description: 'Документы по противодействию коррупции в МУП "Находка-Водоканал"',
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

    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Противодействие коррупции" />
                <h1 className='title'>Противодействие коррупции</h1>

                <section className={styles.section_item}>
                    <h2>{pageData?.title_1}</h2>
                    <ul className={styles.documents_list}>
                        {pageData?.documents && pageData?.documents.length > 0 &&
                            pageData?.documents.map((document, index) => (
                                <li key={index}>
                                <DocumentComponent
                                    title={document?.title}
                                    link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.link}`}
                                />
                                </li>
                            ))}
                    </ul>
                </section>

                <section className={styles.section_item}>
                    <h2>{pageData?.title_2}</h2>
                    <ul className={styles.documents_list}>
                        {pageData?.documents_2 && pageData?.documents_2.length > 0 &&
                            pageData?.documents_2.map((document, index) => (
                                <li key={index}>
                                <DocumentComponent
                                    title={document?.title}
                                    link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.link}`}
                                />
                                </li>
                            ))}
                    </ul>
                </section>

                <section className={styles.section_item}>
                    <h2>{pageData?.title_3}</h2>
                    <ul className={styles.documents_list}>
                        {pageData?.documents_3 && pageData?.documents_3.length > 0 &&
                            pageData?.documents_3.map((document, index) => (
                                <li key={index}>
                                <DocumentComponent
                                    title={document?.title}
                                    link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.link}`}
                                />
                                </li>
                            ))}
                    </ul>
                </section>

                <section className={styles.section_item}>
                    <h2>{pageData?.title_4}</h2>
                    <ul className={styles.documents_list}>
                        {pageData?.documents_4 && pageData?.documents_4.length > 0 &&
                            pageData?.documents_4.map((document, index) => (
                                <li key={index}>
                                <DocumentComponent
                                    title={document?.title}
                                    link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.link}`}
                                />
                                </li>
                            ))}
                    </ul>
                </section>

                <section className={styles.section_item}>
                    <h2>{pageData?.title_5}</h2>
                    <ul className={styles.documents_list}>
                        {pageData?.documents_5 && pageData?.documents_5.length > 0 &&
                            pageData?.documents_5.map((document, index) => (
                                <li key={index}>
                                <DocumentComponent
                                    title={document?.title}
                                    link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.link}`}
                                />
                                </li>
                            ))}
                    </ul>
                </section>  
            </div>
        </section>
    )
} 