'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react";

import logo from '@/../public/logo_w.svg'
import phone from '@/../public/phone_w.svg';
// import uslugi from '@/../public/uslugi.png'
import uslugi from '@/../public/uslugi-gray.svg'
import { Cookies } from "@/app/components";
import fetchData from '@/app/utils/fetchData';

import styles from "./style.module.scss";

type Contact = {
    phone_name: string,
    phone_bot_1: string,
    phone_bot_2: string,
    phone_1: string,
    phone_2: string,
}

type NavLink = {
    title: string;
    href: string;
}

const navLinks: NavLink[] = [
    {
        title: "Главная",
        href: "/"
    },
    {
        title: "Тарифы",
        href: "/rates"
    },
    {
        title: "О компании",
        href: "/about"
    },
    {
        title: "Передача показаний через сайт",
        href: "/transmission-of-readings"
    },
    {
        title: "Обращение в водоканал",
        href: "/contact-us"
    },
    {
        title: "Ввызов оператора",
        href: "/call-controller"
    },
    {
        title: "Калькулятор стоимости подключения",
        href: "/connection"
    },
    {
        title: "Новости",
        href: "/news"
    },
    {
        title: "Противодействие коррупции",
        href: "/anti-corruption"
    },
    {
        title: "Скачать бланки заявлений",
        href: "/download-blank"
    }
]

export default function Footer() {
    const pathname = usePathname();
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const response = await fetchData<{ data: Contact[] }>('/api/kontakties') as any;
                if (response?.data[0].kontakty) {
                    setContacts(response?.data[0].kontakty);
                } else {
                    console.error('Неверный формат ответа от API');
                }
            } catch (error) {
                console.error('Ошибка при загрузке контактов:', error);
            }
        };

        fetchContacts();
    }, []);

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footer_info}>
                    {/* Первая колонка - логотипы */}
                    <div className={styles.logos_column}>
                        <Link href={'/'} className={styles.logo}>
                            <Image src={logo} width={50} height={50} alt="logo" />
                            <div>
                                <p className={`${styles.logo_sub_title} font-inter`}>Муниципальное унитарное предприятие</p>
                                <h1 className={`${styles.logo_title} font-inter font-me`}>«Находка-Водоканал»</h1>
                            </div>
                        </Link>
                        <Link className={styles.uslugi_logo} href={'https://gosuslugi.primorsky.ru/main.htm'} target="_blank">
                            <Image src={uslugi} alt="uslugi" />
                        </Link>

                    </div>

                    {/* Вторая колонка - навигация */}
                    <nav className={styles.nav}>
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className={pathname === link.href ? styles.active : undefined}
                            >
                                {link.title}
                            </Link>
                        ))}
                    </nav>

                    {/* Третья колонка - контакты */}
                    <div className={styles.contacts_column}>
                        {contacts.map((contact, index) => (
                            <div className={styles.wrapper_contact_info} key={index}>
                                <Image
                                    src={phone}
                                    width={20}
                                    height={20}
                                    alt={`Иконка телефона ${contact.phone_name}`}
                                />
                                <div>
                                    <p>{contact.phone_name}</p>
                                    <div className={styles.phone_numbers}>
                                        <Link href={`tel:${contact.phone_bot_1}`}>
                                            {contact.phone_1}
                                        </Link>
                                        <span> , </span>
                                        {contact.phone_bot_2 && (
                                            <>
                                                <Link href={`tel:${contact.phone_bot_2}`}>
                                                    {contact.phone_2}
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Нижний блок с копирайтом и ссылками */}
                <div className={styles.footer_bottom}>
                    <div className={styles.copyright}>
                        © 2025. МУП «Находка-Водоканал». Все права защищены
                    </div>
                    <div className={styles.policy_links}>
                        <Link href="/privacy-policy">Политика конфиденциальности</Link>
                    </div>
                    <div className={styles.terms_links}>
                        <Link href="/terms-of-service">Пользовательское соглашение</Link>
                    </div>
                    <div className={styles.development}>
                        Разработка и продвижение сайтов <a href="https://inside360.ru" target="_blank" rel="noopener noreferrer">INSIDE 360</a>
                    </div>
                </div>
            </div>
            <Cookies />
        </footer>
    )
}