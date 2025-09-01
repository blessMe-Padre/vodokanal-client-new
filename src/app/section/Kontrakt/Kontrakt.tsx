'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react'

import { LinkCustom } from '@/app/components';
import ContentRenderer from '@/app/components/ContentRenderer/ContentRenderer';
import fetchData from '@/app/utils/fetchData';
import formatDate from '@/app/utils/formatDate'

import styles from './style.module.scss'

interface PaymentItem {
    id: number;
    title: string;
    payment: string;
    [key: string]: unknown;
}

interface ContractItem {
    id: number;
    documentId: string;
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    desc: any;
    list_of_payments: PaymentItem[];
    link: string | null;
    img?: {
        url: string;
    };
    [key: string]: unknown;
}

interface ApiResponse {
    data: ContractItem[];
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

export type NewsItem = {
    id: number;
    documentId: string;
    title: string;
    description: string;
    publishedAt?: string;
    content: [],
    display_on_site: boolean,
    image: {
        url: string;
    },
}

export default function Kontrakt() {
    const [kontrakts, setKontrakts] = useState<ContractItem[]>([]);
    const [lastNews, setLastNews] = useState<NewsItem | null>(null);
    console.log(lastNews);

    useEffect(() => {
        const getContracts = async () => {
            const res = await fetchData<ApiResponse>(`/api/kontrakts?populate=*`)
            setKontrakts(res.data)
        }
        getContracts();

        const loadLastNews = async (): Promise<void> => {
            try {
                const url = `/api/novostis` +
                    `?populate=*` +
                    `&sort=createdAt:desc` +
                    `&pagination[page]=1` +
                    `&pagination[pageSize]=1`;

                const lastNewsResponse: NewsResponse = await fetchData(url);
                // Берем первую новость из массива, так как запрашиваем только одну
                setLastNews(lastNewsResponse.data[0] || null);
            } catch (error) {
                console.error('Произошла ошибка загрузки отзывов', error);
            }
        };

        loadLastNews();
    }, [])

    return (
        <section>
            <h2 className="visually-hidden">Заключи контракт на службу</h2>
            <div className={styles.contract_wrapper}>

                {
                    kontrakts && kontrakts.length >= 2 ? (
                        kontrakts?.map((item, idx) => {
                            return (
                                <div key={idx} className={styles.contract_item}>
                                    <div className={styles.item_top}>
                                        <div className={styles.item_image}>
                                            {item.img?.url && (
                                                <Image src={item?.img?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${item.img.url}` : '/placeholder.svg'} alt={item.title} width={180} height={250} />
                                            )}
                                        </div>

                                        <ul className={styles.list_of_payments}>
                                            {item.list_of_payments.map((item, idx) => {
                                                return (
                                                    <li key={idx} className={styles.item_list}>
                                                        <p className={styles.item_list_payment}>{item.payment}</p>
                                                        <p className={styles.item_list_title}>{item.title}</p>
                                                    </li>
                                                )
                                            })}
                                        </ul>

                                    </div>

                                    <div className={styles.item_bottom}>
                                        <div className={styles.content_wrapper}>
                                            <h3 className={styles.item_title}>
                                                {item.title}
                                            </h3>

                                            <div className={styles.desc}>
                                                <ContentRenderer content={item?.desc} />
                                            </div>
                                        </div>


                                        <div className={styles.wrapper}>
                                            <LinkCustom
                                                href={item.link || '/'}
                                                text='Узнать подробнее'
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <>
                            {/* Показываем первый контракт, если он есть */}
                            {kontrakts && kontrakts.length > 0 && (
                                <div className={styles.contract_item}>
                                    <div className={styles.item_top}>
                                        <div className={styles.item_image}>
                                            {kontrakts[0].img?.url && (
                                                <Image src={kontrakts[0]?.img?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${kontrakts[0].img.url}` : '/placeholder.svg'} alt={kontrakts[0].title} width={180} height={250} />
                                            )}
                                        </div>

                                        <ul className={styles.list_of_payments}>
                                            {kontrakts[0].list_of_payments.map((item, idx) => {
                                                return (
                                                    <li key={idx} className={styles.item_list}>
                                                        <p className={styles.item_list_payment}>{item.payment}</p>
                                                        <p className={styles.item_list_title}>{item.title}</p>
                                                    </li>
                                                )
                                            })}
                                        </ul>

                                    </div>

                                    <div className={styles.item_bottom}>
                                        <div className={styles.content_wrapper}>
                                            <h3 className={styles.item_title}>
                                                {kontrakts[0].title}
                                            </h3>

                                            <div className={styles.desc}>
                                                <ContentRenderer content={kontrakts[0]?.desc} />
                                            </div>
                                        </div>

                                        <div className={styles.wrapper}>
                                            <LinkCustom
                                                href={kontrakts[0].link || '/'}
                                                text='Узнать подробнее'
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Показываем последнюю новость */}
                            {lastNews && (
                                <div className={styles.news_item}>

                                    <div className={styles.news_image_wrapper}>
                                        <Link href={`/news/${lastNews.documentId}`}>
                                            <Image
                                                src={lastNews?.image?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${lastNews.image.url}` : '/placeholder.svg'}
                                                alt={'image'}
                                                width={300}
                                                height={250}
                                                loading="lazy"
                                                placeholder="blur"
                                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MiIgaGVpZ2h0PSIxMTg5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiIC8+PC9zdmc+"
                                            />
                                        </Link>
                                    </div>
                                    <Link href={`/news/${lastNews.documentId}`}>
                                        <h3 className={styles.item_title}>{lastNews?.title}</h3>
                                    </Link>
                                    <p className={styles.item_description}>{lastNews?.description}</p>

                                    <footer className={styles.news_footer}>
                                        <p className={styles.item_date}>{formatDate(lastNews.publishedAt)}</p>
                                        <Link className={styles.news_link} href={`/news/${lastNews.documentId}`}>
                                            <span>Узнать подробнее</span>
                                            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.5301 6.5672C13.823 6.2743 13.823 5.79943 13.5301 5.50654L8.75712 0.733564C8.46422 0.440671 7.98935 0.440671 7.69646 0.733564C7.40356 1.02646 7.40356 1.50133 7.69646 1.79422L11.9391 6.03687L7.69646 10.2795C7.40356 10.5724 7.40356 11.0473 7.69646 11.3402C7.98935 11.6331 8.46422 11.6331 8.75712 11.3402L13.5301 6.5672ZM0.0732422 6.03687V6.78687H12.9998V6.03687V5.28687H0.0732422V6.03687Z" fill="#1B4965" />
                                            </svg>
                                        </Link>
                                    </footer>
                                </div>
                            )}
                        </>
                    )
                }

            </div>
        </section>
    )
}