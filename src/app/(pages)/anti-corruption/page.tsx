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

interface AntiCorruptionSections {
    section_title: string;
    documents: Document[];
}

interface AntiCorruptionResponse {
    data: {
        content: AntiCorruptionSections[];
    };
}

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Противодействие коррупции',
    description: 'Документы по противодействию коррупции в МУП "Находка-Водоканал"',
}

export default async function AntiCorruption() {
    const data: AntiCorruptionResponse = await fetchData('/api/stranicza-protivodejstvie-korrupczii?populate[content][populate]=*');
    const sections: AntiCorruptionSections[] = data?.data?.content;
    console.log(sections);

    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Противодействие коррупции" />
                <h1 className='title'>Противодействие коррупции</h1>

                {sections && sections.length > 0 &&
                    sections.map((section, index) => (
                        <section key={index}>
                            <h2>{section?.section_title}</h2>
                            <ul className={styles.documents_list}>
                                {section.documents && section.documents.length > 0 &&
                                    section.documents.map((document, index) => (
                                        <DocumentComponent
                                            key={index}
                                            title={document?.title}
                                            link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.link}`}
                                        />
                                    ))}
                            </ul>
                        </section>
                    ))
                }
            </div>
        </section>
    )
} 