"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
        title: "Контакты",
        href: "/contacts"
    },
    {
        title: "Передача показаний через сайт",
        href: "/terms-of-service"
    },
    {
        title: "Калькулятор",
        href: "/connection"
    }
]

export default function Header() {
    const pathname = usePathname();
    return (
        <header className={styles.header}>
            <div className="container">
                <h1>МУП Находка-Водоканал - header</h1>


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
            </div>
        </header>
    )
}