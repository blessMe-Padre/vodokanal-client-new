import { Breadcrumbs } from "@/app/components";
import DocumentComponent from "@/app/components/DocumentComponent/DocumentComponent";
import fetchData from "@/app/utils/fetchData";

import styles from "./style.module.scss";

type AntiCorruptionList = {
    title: string;
    file: {
        url: string;
    };
}

type AntiCorruptionResponse = {
    data: AntiCorruptionList[];
}

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Противодействие коррупции',
    description: 'Документы по противодействию коррупции в МУП "Находка-Водоканал"',
}

export default async function AntiCorruption() {
    const data: AntiCorruptionResponse = await fetchData('/api/anti-corruption?populate=*');
    const antiCorruptionList: AntiCorruptionList[] = data.data;

    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Противодействие коррупции"/>
                <h1 className='title'>Противодействие коррупции</h1>
                <p className={styles.desc}>
                    В данном разделе размещены документы, регламентирующие деятельность МУП «Находка-Водоканал» 
                    в сфере противодействия коррупции.
                </p>
                <ul className={styles.documentsList}>
                    {antiCorruptionList?.length > 0 &&
                        antiCorruptionList.map((document, index) => (
                            <DocumentComponent
                                key={index}
                                title={document?.title}
                                link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.file?.url}`}
                            />
                        ))}
                </ul>
            </div>
        </section>
    )
} 