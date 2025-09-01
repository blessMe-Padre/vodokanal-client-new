"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import logo from '@/../public/logo.svg'
import phone from '@/../public/phone.svg';
import uslugi from '@/../public/uslugi.png'
import fetchData from "@/app/utils/fetchData";

// import Search from "../Search/Search";

import styles from "./style.module.scss";

import type { Variants } from "framer-motion";

type NavLink = {
    title: string;
    href: string;
}

type Contact = {
    phone_name: string,
    phone_bot_1: string,
    phone_bot_2: string,
    phone_1: string,
    phone_2: string,
}

const navLinks: NavLink[] = [
    {
        title: "Главная",
        href: "/"
    },
    {
        title: "Тарифы и нормативы",
        href: "/rates"
    },
    {
        title: "О компании",
        href: "/about"
    },
    // {
    //     title: "Передача показаний через сайт",
    //     href: "/transmission-of-readings"
    // },
    {
        title: "Новости",
        href: "/news"
    },
    {
        title: "Скачать бланки заявлений",
        href: "/download-blank"
    },
    {
        title: "Раскрытие информации",
        href: "/disclosure"
    },
    {
        title: "Реквизиты",
        href: "/requisites"
    }
]

export default function Header() {
    // const [searchOpened, setSearchOpened] = useState(false);
    const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);

    // закрываем поиск при клике вне попапа
    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (!searchOpened) return;

    //         const isClickOutsideMenu = !menuRef.current || !menuRef.current.contains(event.target as Node);
    //         const isClickOutsideButton = !buttonRef.current || !buttonRef.current.contains(event.target as Node);

    //         if (isClickOutsideMenu && isClickOutsideButton) {
    //             setSearchOpened(false);
    //         }
    //     };

    //     const handleSliderClick = () => {
    //         setSearchOpened(false);
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     document.addEventListener("sliderClick", handleSliderClick);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //         document.removeEventListener("sliderClick", handleSliderClick);
    //     };
    // }, [searchOpened]);

    // const buttonRef = useRef<HTMLButtonElement>(null);
    // const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetchData<{ data: { [key: number]: { kontakty: Contact[] } } }>('/api/kontakties');

                if (response?.data[0]?.kontakty) {
                    setContacts(response?.data[0]?.kontakty as Contact[]);
                } else {
                    console.error('Неверный формат ответа от API');
                }
            } catch (error) {
                console.error('Ошибка при загрузке контактов:', error);
            }
        };

        fetchContacts();
    }, []);

    // const buttonRef = useRef<HTMLButtonElement>(null);
    // const menuRef = useRef<HTMLDivElement>(null);

    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Работа с поиском
    // const variants: Variants = {
    //     visible: {
    //         opacity: 1,
    //         height: "auto",
    //         visibility: "visible",
    //         transition: {
    //             when: "beforeChildren",
    //             staggerChildren: 0.1,
    //         },
    //     },
    //     hidden: {
    //         opacity: 0,
    //         height: 0,
    //         visibility: "hidden",
    //     },
    // };

    // Работа с мобильным меню
    const mobileMenuVariants: Variants = {
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
        hidden: {
            x: "-100%",
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpened(!mobileMenuOpened);
    };

    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.header_top}>
                    <button
                        className={styles.burger_menu}
                        onClick={toggleMobileMenu}
                        aria-label="Открыть меню"
                    >
                        <span className={`${styles.burger_line} ${mobileMenuOpened ? styles.active : ''}`}></span>
                        <span className={`${styles.burger_line} ${mobileMenuOpened ? styles.active : ''}`}></span>
                        <span className={`${styles.burger_line} ${mobileMenuOpened ? styles.active : ''}`}></span>
                    </button>

                    <Link href={'/'} className={styles.logo}>
                        <Image src={logo} width={50} height={50} alt="logo" />
                        <div>
                            <p className={`${styles.logo_sub_title} font-inter`}>Муниципальное унитарное предприятие</p>
                            <h1 className={`${styles.logo_title} font-inter font-me`}>«Находка-Водоканал» </h1>
                        </div>
                    </Link>
                    <Link href={'/'} className={styles.mobile_logos}>
                        <Image src={logo} width={30} height={30} alt="logo" />
                        <div>
                            <p className={`${styles.logo_sub_title} font-inter`}>Муниципальное унитарное предприятие</p>
                            <h1 className={`${styles.logo_title} font-inter font-me`}>«Находка-Водоканал»</h1>
                        </div>
                    </Link>

                    <Link href={'https://gosuslugi.primorsky.ru/main.htm'} className={styles.mobile_logos} target="_blank">
                        <Image src={uslugi} width={120} height={30} alt="uslugi" />
                    </Link>

                    <div className={styles.desktop_contacts}>
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

                    <Link href={'https://gosuslugi.primorsky.ru/main.htm'} className={styles.desktop_logo} target="_blank">
                        <Image src={uslugi} alt="uslugi" />
                    </Link>
                </div>

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

                <motion.div
                    ref={mobileMenuRef}
                    variants={mobileMenuVariants}
                    initial={"hidden"}
                    animate={mobileMenuOpened ? "visible" : "hidden"}
                    className={styles.mobile_menu}
                >
                    <div className={styles.mobile_menu_header}>
                        <button
                            className={styles.close_menu}
                            onClick={toggleMobileMenu}
                            aria-label="Закрыть меню"
                        >
                            <span className={styles.close_line}></span>
                            <span className={styles.close_line}></span>
                        </button>
                    </div>

                    <nav className={styles.mobile_nav}>
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className={pathname === link.href ? styles.active : undefined}
                                onClick={() => setMobileMenuOpened(false)}
                            >
                                {link.title}
                            </Link>
                        ))}
                    </nav>

                    <div className={styles.mobile_contacts}>
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
                </motion.div>

                {/* <button
                    ref={buttonRef}
                    className={`${styles.button}`}
                    onClick={() => setSearchOpened(!searchOpened)}
                    title='Поиск'
                >
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.57129 0.799805C12.9077 0.799805 16.3926 4.22886 16.3926 8.42188C16.3926 12.6149 12.9077 16.0439 8.57129 16.0439C4.23496 16.0439 0.75 12.6149 0.75 8.42188C0.750013 4.2289 4.23497 0.799878 8.57129 0.799805Z" strokeWidth="1.5" stroke="#1B4965"></path><path d="M14.1426 14.2822L17.9997 18.0497" strokeWidth="1.5" strokeLinecap="round" stroke="#1B4965"></path></svg>
                </button> */}

                {/* <motion.div
                    ref={menuRef}
                    layout
                    variants={variants}
                    initial={"hidden"}
                    animate={searchOpened ? "visible" : "hidden"}
                    className="overflow-hidden"
                >
                    <Search />
                </motion.div> */}

            </div>
        </header>
    )
}