"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import fetchData from "@/app/utils/fetchData";
import formatDate from '@/app/utils/formatDate'

import styles from "./style.module.scss";


export type NewsItem = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    publishedAt?: string;
    isMain: boolean;
    content: [],
    display_on_site: boolean,
    image: {
        url: string;
    },
}

export type NewsResponse = {
    data: NewsItem[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    };
}

export default function PageContent() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsMain, setNewsMain] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(false);

    console.log(newsMain);

    // для пагинации
    const PAGE_SIZE: number = 6; // количество новостей на странице
    const [page, setPage] = useState<number>(1);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    }

    // загрузка главных новостей отдельный запросом и фильтрацией в нём же
    useEffect(() => {
        const loadData = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const url =
                    `/api/novostis` +
                    `?populate=*` +
                    `&filters[display_on_site][$eq]=true` +
                    `&filters[isMain][$eq]=true` +
                    `&sort=publishedAt:desc`

                const newNewsMain: NewsResponse = await fetchData(url);
                setNewsMain(newNewsMain.data);
                setIsLoading(false);

            } catch (error) {
                console.error('Произошла ошибка загрузки отзывов', error);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const url =
                    `/api/novostis` +
                    `?populate=*` +
                    `&filters[display_on_site][$eq]=true` +
                    `&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}` +
                    `&sort=createdAt:desc`
                    ;

                const newNews: NewsResponse = await fetchData(url);
                setNews(prev => [...prev, ...newNews.data]);
                setHasMore(page < newNews.meta.pagination.pageCount);
                setIsLoading(false);

            } catch (error) {
                console.error('Произошла ошибка загрузки отзывов', error);
            }
        };

        loadData();
    }, [page]);

    return (
        <section className={styles.section}>
            <h2 className="visually-hidden">последние новости</h2>
            <ul className={styles.list_main}>
                {newsMain && newsMain.length > 0 ?
                    (newsMain.map((item, index) => {
                        return (
                            <li className={`${styles.news_item} ${styles.news_item_main}`} key={index}>

                                <div className={styles.news_image_wrapper}>
                                    <Link className={styles.news_link} href={`/news/${item.documentId}`}>
                                        <Image
                                            src={item?.image?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${item.image.url}` : '/placeholder.svg'}
                                            alt={'image'}
                                            width={300}
                                            height={250}
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MiIgaGVpZ2h0PSIxMTg5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiIC8+PC9zdmc+"
                                        />
                                    </Link>
                                </div>
                                <div className={styles.item_block}>
                                    <div>
                                        <Link className={styles.news_link} href={`/news/${item.documentId}`}>
                                            <h3 className={styles.item_title}>{item?.title}</h3>
                                        </Link>
                                        <p className={styles.item_description}>{item?.description}</p>
                                    </div>

                                    <footer className={styles.news_footer}>
                                        <p className={styles.item_date}>{formatDate(item.publishedAt)}</p>
                                        <Link className={styles.news_link} href={`/news/${item.documentId}`}>
                                            <span>Узнать подробнее</span>
                                            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.5301 6.5672C13.823 6.2743 13.823 5.79943 13.5301 5.50654L8.75712 0.733564C8.46422 0.440671 7.98935 0.440671 7.69646 0.733564C7.40356 1.02646 7.40356 1.50133 7.69646 1.79422L11.9391 6.03687L7.69646 10.2795C7.40356 10.5724 7.40356 11.0473 7.69646 11.3402C7.98935 11.6331 8.46422 11.6331 8.75712 11.3402L13.5301 6.5672ZM0.0732422 6.03687V6.78687H12.9998V6.03687V5.28687H0.0732422V6.03687Z" fill="#1B4965" />
                                            </svg>
                                        </Link>
                                    </footer>
                                </div>
                            </li>
                        )
                    }))
                    : isLoading ? <p>Загрузка...</p> : <p>Новостей нет</p>}
            </ul>

            <ul className={styles.list}>
                {news && news.length > 0 ?
                    (news.map((item, index) => {
                        return (
                            <li className={styles.news_item} key={index}>

                                <div className={styles.news_image_wrapper}>
                                    <Link className={styles.news_link} href={`/news/${item.documentId}`}>
                                        <Image
                                            src={item?.image?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${item.image.url}` : '/placeholder.svg'}
                                            alt={'image'}
                                            width={300}
                                            height={250}
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MiIgaGVpZ2h0PSIxMTg5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiIC8+PC9zdmc+"
                                        />
                                    </Link>
                                </div>
                                <Link href={`/news/${item.documentId}`}>
                                    <h3 className={styles.item_title}>{item?.title}</h3>
                                </Link>
                                <p className={styles.item_description}>{item?.description}</p>

                                <footer className={styles.news_footer}>
                                    <p className={styles.item_date}>{formatDate(item.publishedAt)}</p>
                                    <Link className={styles.news_link} href={`/news/${item.documentId}`}>
                                        <span>Узнать подробнее</span>
                                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.5301 6.5672C13.823 6.2743 13.823 5.79943 13.5301 5.50654L8.75712 0.733564C8.46422 0.440671 7.98935 0.440671 7.69646 0.733564C7.40356 1.02646 7.40356 1.50133 7.69646 1.79422L11.9391 6.03687L7.69646 10.2795C7.40356 10.5724 7.40356 11.0473 7.69646 11.3402C7.98935 11.6331 8.46422 11.6331 8.75712 11.3402L13.5301 6.5672ZM0.0732422 6.03687V6.78687H12.9998V6.03687V5.28687H0.0732422V6.03687Z" fill="#1B4965" />
                                        </svg>
                                    </Link>
                                </footer>
                            </li>
                        )
                    }))
                    : isLoading ? <p>Загрузка...</p> : <p>Новостей нет</p>}
            </ul>
            {
                hasMore &&
                <button
                    onClick={handleLoadMore}
                    className={styles.load_more_button}
                >
                    {isLoading ? 'загрузка...' : 'загрузить еще'}
                </button>
            }
        </section>
    )
}