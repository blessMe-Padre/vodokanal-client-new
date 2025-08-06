'use client'

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import fetchData from '@/app/utils/fetchData';

import styles from './style.module.scss';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

type NewsType = {
    id: number;
    documentId: string;
    title?: string;
    description?: string;
    image?: {
        url: string;
    };
    display_on_site?: boolean;
}

export default function News() {
    const [news, setNews] = useState<NewsType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const news = await fetchData('/api/novostis?populate=*&filters[display_on_site][$eq]=true&sort=createdAt:desc');
                setNews(news.data);
            } catch (error) {
                console.log('Произошла ошибка при получении новостей', error);
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, []);


    return (
        <div className={styles.swiper_wrapper}>
            <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={20}
                loop={true}
                // autoplay={{
                //     delay: 2500,
                //     disableOnInteraction: false,
                // }}
                speed={1500}
                pagination={{
                    clickable: true,
                    el: '.custom-pagination',
                }}
                navigation={{
                    nextEl: '.custom-navigation .swiper-button-next',
                    prevEl: '.custom-navigation .swiper-button-prev',
                }}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    375: { slidesPerView: 1.5 },
                    560: { slidesPerView: 3 },
                }}
            >

                {
                    news && news.length > 0 ?
                        (
                            news.map((item, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div className={styles.news_item}>
                                            <Link href={`/news/${item.documentId}`}>
                                                <Image
                                                    src={item?.image?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${item.image.url}` : '/placeholder.svg'}
                                                    alt={'image'}
                                                    width={300}
                                                    height={250}
                                                    loading="lazy"
                                                    placeholder="blur"
                                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MiIgaGVpZ2h0PSIxMTg5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiIC8+PC9zdmc+"
                                                />
                                                <h3>{item?.title}</h3>
                                                <p>{item?.description}</p>
                                            </Link>
                                        </div>
                                    </SwiperSlide>
                                )
                            }
                            )
                        ) : loading ? <p>Загрузка...</p> : <p>Новостей нет</p>}

                <div className={`custom-pagination ${styles.custom_pagination}`} />

                <div className={`custom-navigation ${styles.custom_navigation}`}>
                    <button className="swiper-button-next" />
                    <button className="swiper-button-prev" />
                </div>
            </Swiper>
            <Link className={styles.news_link} href="/news">Смотреть все новости</Link>
        </div>
    )
}