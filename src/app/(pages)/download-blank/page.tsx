import { Breadcrumbs, DownloadDocumentComponent, AnimateElement } from "@/app/components";
import fetchData from "@/app/utils/fetchData";

import styles from "./style.module.scss";

type RatesList = {
    title: string;
    file: {
        url: string;
    };
}

type RatesResponse = {
    data: RatesList[];
}

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Скачать бланки',
    description: 'Скачать бланки для юридических лиц',
}

export default async function Rates() {
    const data: RatesResponse = await fetchData('/api/blanki-dlya-yuridicheskih-liczs?populate=*');
    const data2: RatesResponse = await fetchData('/api/blanki-dlya-fizicheskij-liczs?populate=*');
    const ratesList: RatesList[] = data.data;
    const ratesList2: RatesList[] = data2.data;


    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Тарифы и нормативы" />
                <h1 className='title'>Скачать бланки</h1>
                <p className={styles.desc}>В этом разделе размещаются бланки для юридических лиц</p>
                <ul className={styles.ratesList}>
                    {ratesList.length > 0 &&
                        ratesList.map((rate, index) => (
                            <AnimateElement
                                element="li"
                                animationName='fadeRight'
                                animationDelay={index * 100}
                                key={index}
                            >
                                <DownloadDocumentComponent
                                    key={index}
                                    title={rate?.title}
                                    link={`${process.env.NEXT_PUBLIC_API_SERVER}${rate?.file?.url}`}
                                />

                            </AnimateElement>
                        ))}
                </ul>
                <p className={styles.desc}>В этом разделе размещаются бланки для физических лиц</p>
                <ul className={styles.ratesList}>
                    {ratesList2.length > 0 &&
                        ratesList2.map((rate, index) => (
                            <AnimateElement
                                element="li"
                                animationName='fadeRight'
                                animationDelay={index * 100}
                                key={index}
                            >
                                <DownloadDocumentComponent
                                    key={index}
                                    title={rate?.title}
                                    link={`${process.env.NEXT_PUBLIC_API_SERVER}${rate?.file?.url}`}
                                />
                            </AnimateElement>
                        ))}
                </ul>
            </div>
        </section>
    )
}