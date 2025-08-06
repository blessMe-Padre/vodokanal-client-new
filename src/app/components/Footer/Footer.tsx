'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import logo from '@/../public/logo_w.svg'
import phone from '@/../public/phone_w.svg';
import uslugi from '@/../public/uslugi.svg'
import { Cookies } from "@/app/components";

import styles from "./style.module.scss";


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
        title: "Связаться с нами",
        href: "/contact-us"
    },
    {
        title: "Вызвать оператора",
        href: "/call-controller"
    },
    {
        title: "Калькулятор",
        href: "/connection"
    },
    {
        title: "Новости",
        href: "/news"
    },
    {
        title: "Противодействие коррупции",
        href: "/anti-corruption"
    }
]

export default function Footer() {
    const pathname = usePathname();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footer_info}>
                    {/* Первая колонка - логотипы */}
                    <div className={styles.logos_column}>
                        <div className={styles.uslugi_logo}>
                            <Image src={uslugi} alt="uslugi" />
                        </div>
                        <div className={styles.logo}>
                            <Image src={logo} width={50} height={50} alt="logo" />
                            <div>
                                <p className={`${styles.logo_sub_title} font-inter`}>Муниципальное унитарное предприятие</p>
                                <h1 className={`${styles.logo_title} font-inter font-me`}>МУП Находка-Водоканал</h1>
                            </div>
                        </div>
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
                        <div className={styles.wrapper_contact_info}>
                            <Image src={phone} width={25} height={25} alt="phone" />
                            <div>
                                <p>Для жителей многоквартирных домов</p>
                                <a href="+7 984 195 8355, 745-582">+7 984 195 8355, 745-582</a>
                            </div>
                        </div>
                        <div className={styles.wrapper_contact_info}>
                            <Image src={phone} width={25} height={25} alt="phone" />
                            <div>
                                <p>Для жителей частного сектора</p>
                                <a href="+7 914 719 6831, 634-132">+7 914 719 6831, 634-132</a>
                            </div>
                        </div>
                        <div className={styles.wrapper_contact_info}>
                            <Image src={phone} width={25} height={25} alt="phone" />
                            <div>
                                <p>Для юридических лиц</p>
                                <a href="+7 914 716 5619, 744-539">+7 914 716 5619, 744-539</a>
                            </div>
                        </div>
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