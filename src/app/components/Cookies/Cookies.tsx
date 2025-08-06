'use client'
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import styles from './style.module.css';

export default function Cookies() {
    const [open, setOpen] = useState(false);

    const UTCDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toUTCString();
    const cookiesStorage = useMemo(() => ({
        getItem: (key: string) => {
            const cookies = document.cookie
                .split(';')
                .map(cookie => cookie.split('='))
                .reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: value }), {} as Record<string, string | undefined>);

            return cookies[key] as string;
        },
        setItem: (key: string, value: string) => {
            document.cookie = `${key}=${value};expires=${UTCDate}`;
        }
    }), [UTCDate])

    useEffect(() => {
        if (cookiesStorage.getItem('site_consent') === 'true') {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [cookiesStorage]);

    const handleClick = () => {
        setOpen(false);
        cookiesStorage.setItem('site_consent', 'true');
    }

    return (
        <div className={`${styles.popup} ${open ? styles.popup_active : ''}`}>
            <span>Мы используем cookies, чтобы сайт был лучше. <Link className={styles.link} href='/cookies'>Что это?</Link></span>

            <div className={styles.button_wrapper}>
                <button
                    className={styles.button}
                    onClick={handleClick}
                >
                    Принять
                </button>
                <button
                    className={styles.button_cancel}
                    onClick={handleClick}
                >
                    Отклонить
                </button>
            </div>
        </div>
    )
}
