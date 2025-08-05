"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import logo from '@/../public/logo.svg'
import phone from '@/../public/phone.svg';
import uslugi from '@/../public/uslugi.svg'

import Search from "../Search/Search";

import styles from "./style.module.scss";

import type { Variants } from "framer-motion";



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
        title: "Контакты",
        href: "/contacts"
    },
    {
        title: "Передача показаний через сайт",
        href: "/terms-of-service"
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
        title: "О компании",
        href: "/about"
    }
]

export default function Header() {
    const [searchOpened, setSearchOpened] = useState(false);

    // закрываем поиск при клике вне попапа
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!searchOpened) return;

            const isClickOutsideMenu = !menuRef.current || !menuRef.current.contains(event.target as Node);
            const isClickOutsideButton = !buttonRef.current || !buttonRef.current.contains(event.target as Node);

            if (isClickOutsideMenu && isClickOutsideButton) {
                setSearchOpened(false);
            }
        };

        const handleSliderClick = () => {
            setSearchOpened(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("sliderClick", handleSliderClick);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("sliderClick", handleSliderClick);
        };
    }, [searchOpened]);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Работа с поиском
    const variants: Variants = {
        visible: {
            opacity: 1,
            height: "auto",
            visibility: "visible",
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        hidden: {
            opacity: 0,
            height: 0,
            visibility: "hidden",
        },
    };


    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.header_top}> 
                    <div className={styles.logo}>
                        <Image src={logo} width={50} height={50} alt="logo" />
                        <div>
                            <p className={`${styles.logo_sub_title} font-inter`}>Муниципальное унитарное предприятие</p>
                            <h1 className={`${styles.logo_title} font-inter font-me`}>МУП Находка-Водоканал</h1>
                        </div>
                    </div>

                    <div>
                        <Image src={uslugi} alt="uslugi" />
                    </div>

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

                <button
                    ref={buttonRef}
                    className={`${styles.button}`}
                    onClick={() => setSearchOpened(!searchOpened)}
                    title='Поиск'
                >
                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.57129 0.799805C12.9077 0.799805 16.3926 4.22886 16.3926 8.42188C16.3926 12.6149 12.9077 16.0439 8.57129 16.0439C4.23496 16.0439 0.75 12.6149 0.75 8.42188C0.750013 4.2289 4.23497 0.799878 8.57129 0.799805Z" strokeWidth="1.5"></path><path d="M14.1426 14.2822L17.9997 18.0497" strokeWidth="1.5" strokeLinecap="round"></path></svg>
                </button>

                <motion.div
                    ref={menuRef}
                    layout
                    variants={variants}
                    initial={"hidden"}
                    animate={searchOpened ? "visible" : "hidden"}
                    className="overflow-hidden"
                >
                    <Search />
                </motion.div>

            </div>
        </header>
    )
}