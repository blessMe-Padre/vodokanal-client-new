import DocumentComponent from "@/app/components/DocumentComponent/DocumentComponent";

import styles from "./style.module.scss";

type RatesList = {
    title: string;
    link: string;
}

const ratesList: RatesList[] = [
    {
        title: 'Постановление Агенства по тарифам ПК № 50.3 от 28.11.2024 г',
        link: '/rates.pdf',
    },
    {
        title: 'Постановление о тарифах на тех присоединение',
        link: '/rates.pdf',
    },
    {
        title: 'Постановление о тарифах на 2024 - 2028 г. № 61.2 от 29.11.2024 г',
        link: '/rates.pdf',
    },
    {
        title: 'Постановление о присоединении 2024',
        link: '/rates.pdf',
    },
]

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Тарифы',
    description: 'Тарифы на услуги водоснабжения и водоотведения',
}

export default function Rates() {
    return (
        <div className="container">
            <h1>Тарифы</h1>

            <ul className={styles.ratesList}>
                {ratesList.length > 0 &&
                    ratesList.map((rate, index) => (
                        <DocumentComponent
                            key={index}
                            title={rate.title}
                            link={rate.link}
                        />
                    ))}
            </ul>
        </div>
    )
}