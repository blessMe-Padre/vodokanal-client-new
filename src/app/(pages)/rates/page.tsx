import DocumentComponent from "@/app/components/DocumentComponent/DocumentComponent";
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
        <div className="container">
            <h1>Тарифы</h1>

            <ul className={styles.ratesList}>
                {ratesList.length > 0 &&
                    ratesList.map((rate, index) => (
                        <DocumentComponent
                            key={index}
                            title={rate?.title}
                            link={`${process.env.NEXT_PUBLIC_API_SERVER}${rate?.file?.url}`}
                        />
                    ))}
            </ul>
        </div>
    )
}