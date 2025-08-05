import Image from 'next/image';

import logo from '@/../public/logo.svg'
import phone from '@/../public/phone.svg';
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

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footer_info}>


                    <div>
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
            </div>
            <Cookies />
        </footer>
    )
}