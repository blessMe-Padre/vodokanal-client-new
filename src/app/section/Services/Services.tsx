import Image from 'next/image';
import Link from 'next/link';

import service_1 from '@/app/../../public/1_s.svg';
import service_2 from '@/app/../../public/2_s.svg';
import service_3 from '@/app/../../public/3_s.svg';
import service_4 from '@/app/../../public/4_s.svg';

import styles from './style.module.scss';

import type { StaticImageData } from 'next/image';

type Services = {
    title: string,
    image: StaticImageData,
    link: string,
    desc: string
}

const items: Services[] = [
    {
        title: 'Подключение к сетям',
        image: service_1,
        desc: 'Заявление на технологическое присоединение объекта к системам водоснабжения / водоотведения',
        link: '/connection'
    },
    {
        title: 'Передача показаний через сайт',
        image: service_2,
        desc: 'Достаточно лишь заполнить несколько полей и подтвердить смс кодом',
        link: '/send-data'
    },
    {
        title: 'Вызвать контролера',
        image: service_3,
        desc: 'Заполните заявку и контролер свяжется с вами для согласования времени',
        link: '/call-controller'
    },
    {
        title: 'Обращение в водоканал',
        image: service_4,
        desc: 'Официальное обращение в МУП "Находка-Водоканал" по любому вопросу',
        link: '/contact-us'
    },
]

export default function Services() {
    return (
        <section className={styles.services_section}>
            <div className={styles.services_grid}>
                {items.map((item, index) => (
                    <Link href={item.link} key={index} className={styles.service_card}>
                        <div className={styles.service_content}>
                            <div className={styles.service_image}>
                                <Image src={item.image} alt={item.title} width={80} height={80} />
                            </div>
                            <h3 className={styles.service_title}>{item.title}</h3>
                            <p className={styles.service_desc}>{item.desc}</p>
                            <div className={styles.service_arrow}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}