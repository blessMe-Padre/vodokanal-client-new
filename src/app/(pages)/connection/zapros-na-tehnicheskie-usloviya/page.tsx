import Link from "next/link";

import { Breadcrumbs, StatementForm } from "@/app/components";

import styles from "../style.module.scss";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Запрос на технические условия',
    description: 'Запрос на технические условия МУП "Находка-Водоканал"',
}

export default async function page() {
    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs
                    secondLabel="Подключение к сетям"
                    secondLink='/connection'
                    thirdLabel="Запрос на технические условия"
                />
                <h1 className='title'>Запрос на технические условия</h1>

                <ul className={styles.list}>
                    <li className={styles.item}><Link href={'№'}><span>Для физических лиц и ИЖС</span>
                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.8025 6.98638C14.0954 6.69349 14.0954 6.21862 13.8025 5.92572L9.02958 1.15275C8.73668 0.85986 8.26181 0.85986 7.96892 1.15275C7.67602 1.44565 7.67602 1.92052 7.96892 2.21341L12.2116 6.45605L7.96892 10.6987C7.67602 10.9916 7.67602 11.4665 7.96892 11.7594C8.26181 12.0522 8.73668 12.0522 9.02958 11.7594L13.8025 6.98638ZM0.345703 6.45605V7.20605H13.2722V6.45605V5.70605H0.345703V6.45605Z" />
                        </svg></Link></li>
                    <li className={styles.item}><Link href={'№'}><span>Для юридических лиц</span>
                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.8025 6.98638C14.0954 6.69349 14.0954 6.21862 13.8025 5.92572L9.02958 1.15275C8.73668 0.85986 8.26181 0.85986 7.96892 1.15275C7.67602 1.44565 7.67602 1.92052 7.96892 2.21341L12.2116 6.45605L7.96892 10.6987C7.67602 10.9916 7.67602 11.4665 7.96892 11.7594C8.26181 12.0522 8.73668 12.0522 9.02958 11.7594L13.8025 6.98638ZM0.345703 6.45605V7.20605H13.2722V6.45605V5.70605H0.345703V6.45605Z" />
                        </svg>
                    </Link></li>
                    <li className={styles.item}><Link href={'№'}><span>Для органов власти
                        и самоуправления</span>
                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.8025 6.98638C14.0954 6.69349 14.0954 6.21862 13.8025 5.92572L9.02958 1.15275C8.73668 0.85986 8.26181 0.85986 7.96892 1.15275C7.67602 1.44565 7.67602 1.92052 7.96892 2.21341L12.2116 6.45605L7.96892 10.6987C7.67602 10.9916 7.67602 11.4665 7.96892 11.7594C8.26181 12.0522 8.73668 12.0522 9.02958 11.7594L13.8025 6.98638ZM0.345703 6.45605V7.20605H13.2722V6.45605V5.70605H0.345703V6.45605Z" />
                        </svg></Link></li>
                </ul>


                <StatementForm />

            </div>
        </section>
    )
} 