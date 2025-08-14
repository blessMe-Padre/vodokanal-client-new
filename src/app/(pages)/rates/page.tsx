import { Breadcrumbs } from "@/app/components";
import { AnimateElement, DocumentComponent } from "@/app/components";
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
    title: 'МУП "Находка-Водоканал" - Тарифы',
    description: 'Тарифы на услуги водоснабжения и водоотведения',
}

export default async function Rates() {
    const data: RatesResponse = await fetchData('/api/tarify-i-normativies?populate=*');
    const ratesList: RatesList[] = data.data;

    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Тарифы и нормативы" />
                <h1 className='title'>Тарифы</h1>
                <p className={styles.desc}>В этом разделе размещаются нормативные акты, определяющие стоимость услуг МУП «Находка-Водоканал».</p>
                <ul className={styles.ratesList}>
                    {ratesList.length > 0 &&
                        ratesList.map((rate, index) => (
                            <AnimateElement
                                element="li"
                                animationName='fadeRight'
                                animationDelay={index * 100}
                                key={index}
                            >
                                <DocumentComponent
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