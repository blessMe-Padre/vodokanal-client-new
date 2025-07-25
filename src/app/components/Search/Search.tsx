'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

import fetchData from '../../utils/fetchData';

import styles from "./style.module.scss";

type NewsItem = {
    title: string;

    // сюда дописывать другие поля из API
}

export default function Search() {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataList, setData] = useState<NewsItem[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    const router = useRouter();

    // Исправлено: типизация для setTimeout/clearTimeout
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setInputValue('');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const handleSearchSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;
        // Редирект
        router.push(`/search?query=${encodeURIComponent(inputValue.trim())}`);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.which === 13) {
            // Редирект
            router.push(`/search?query=${encodeURIComponent(inputValue.trim())}`);
        }
    }

    const highlightText = (text: string, highlight: string) => {
        if (!highlight) return text;

        const regex = new RegExp(`(${highlight})`, 'i');
        const match = text.match(regex);

        if (!match) return text;

        const parts = text.split(regex);
        return (
            <>
                {parts[0]}
                <mark>{parts[1]}</mark>
                {parts[2]}
            </>
        );
    };

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current)
        }

        if (inputValue.trim() === '') {
            setData([])
            return
        }

        setLoading(true)
        debounceTimeout.current = setTimeout(async () => {
            try {
                // Тут можно добавить другие API источники, добавить в промис и объединить результаты
                const newsUrl = `/api/novostis?filters[title][$containsi]=${encodeURIComponent(inputValue)}&populate=*`;
                const tariffsUrl = `/api/tarify-i-normativies?filters[title][$containsi]=${encodeURIComponent(inputValue)}&populate=*`;


                const [newsResult, tariffsResult] = await Promise.all([
                    fetchData(newsUrl),
                    fetchData(tariffsUrl)
                ]);

                const combinedData = [
                    ...(newsResult?.data || []),
                    ...(tariffsResult?.data || [])
                ];
                setData(combinedData);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки Объектов:', error)
                setLoading(false);
            }
        }, 1000)

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        }
    }, [inputValue])

    return (
        <div className={styles.search_wrapper}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.input_area}>
                        <input
                            type='text'
                            value={inputValue}
                            onChange={handleChange}
                            onFocus={() => setIsFocused(true)}
                            onKeyUp={handleKeyUp}
                            onBlur={() => setTimeout(() => setIsFocused(false), 1000)} // задержка, чтобы кликнуть по элементу
                            className={styles.input}
                            placeholder='Поиск'
                        />

                        <button
                            className={styles.delete}
                            onClick={handleDelete}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.81282 0.0450334L15.955 14.1872L14.1872 15.9549L0.0450488 1.8128L1.81282 0.0450334Z" fill="#6B6B6B" />
                                <path d="M15.955 1.8128L1.81282 15.9549L0.0450482 14.1872L14.1872 0.0450334L15.955 1.8128Z" fill="#6B6B6B" />
                            </svg>
                        </button>

                        <button className={styles.submit} type="submit" onClick={handleSearchSubmit}>
                            Найти
                        </button>
                    </div>

                    {
                        isFocused && (
                            <ul className={styles.list}>
                                {inputValue.trim() === '' && <li>Начните печатать</li>}
                                {loading && <p>Загрузка...</p>}
                                {!loading && dataList.length === 0 && inputValue.trim() !== '' && (
                                    <li>Ничего не найдено</li>
                                )}

                                {
                                    !loading &&
                                    dataList.map((item, index) => {
                                        return (
                                            <li key={index} className={styles.item}>
                                                <span className={styles.item_title}>{highlightText(item?.title, inputValue)}</span>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        )
                    }
                </div>
            </div>
        </div>
    )
}