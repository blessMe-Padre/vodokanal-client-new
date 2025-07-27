"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import fetchData from "@/app/utils/fetchData";

import styles from "./style.module.scss";


export type NewsItem = {
    id: number;
    documentId: string;
    title: string;
    description: string;
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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(false);

    // для пагинации
    const PAGE_SIZE: number = 2; // количество новостей на странице
    const [page, setPage] = useState<number>(1);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    }

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
        <section>
            <h2>последние новости</h2>
            <ul className={styles.news_list}>
                {
                    news && news.length > 0 ?
                        news.map((item, index) => (
                            <li key={index}>
                                <article>
                                    <Link href={`/news/${item?.documentId}`}>
                                        <Image
                                            src={item?.image?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${item.image.url}` : '/placeholder.svg'}
                                            alt={item?.title}
                                            width={300}
                                            height={250}
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MiIgaGVpZ2h0PSIxMTg5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiIC8+PC9zdmc+"
                                        />
                                        <h3>{item?.title}</h3>
                                        <p>{item?.description}</p>
                                    </Link>
                                </article>
                            </li>
                        ))
                        : isLoading ? <p>Загрузка...</p> : <p>Новостей нет</p>
                }
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