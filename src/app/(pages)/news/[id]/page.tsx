import Image from "next/image";

import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import ContentRenderer, { ContentItem } from "@/app/components/ContentRenderer/ContentRenderer";
import fetchData from "@/app/utils/fetchData";
import formatDate from '@/app/utils/formatDate'

import styles from "../style.module.scss"

interface NewsData {
    title: string;
    description?: string;
    image?: {
        url: string;
    };
    content?: ContentItem[];
    publishedAt: string;
}

interface ApiResponse {
    data: NewsData;
}

export const revalidate = 600; // 10 минут

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const page = await fetchData<ApiResponse>(`/api/novostis/${id}?populate=*`);

    return {
        title: `МУП "Находка-Водоканал | ${page?.data?.title}`,
        description: page?.data?.description,
        openGraph: {
            title: `МУП "Находка-Водоканал | ${page?.data?.title}`,
            description: page?.data?.description,
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_API_SERVER}${page?.data?.image?.url}`,
                    width: 600,
                    height: 300,
                    alt: page?.data?.title,
                },
            ],
        },
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const page = await fetchData<ApiResponse>(`/api/novostis/${id}?populate=*`);

    return (
        <div className="container">
            <Breadcrumbs secondLink="/news" secondLabel="Новости" thirdLabel={page?.data?.title} />
            <article className={styles.article}>
                <div className={`${styles.article_img}`}>
                    <Image
                        src={page?.data?.image?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${page.data.image.url}` : '/placeholder.svg'}
                        alt={page?.data?.title}
                        width={600}
                        height={300}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MiIgaGVpZ2h0PSIxMTg5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiIC8+PC9zdmc+"
                        />
                </div>
                <div className={styles.article_content}>
                    <div>
                        <h1 className={styles.article_title}>{page?.data?.title}</h1>
                        {page?.data?.content && (
                            <ContentRenderer content={page.data.content} />
                        )}
                    </div>
                    <p className={styles.item_date}>{formatDate(page?.data?.publishedAt)}</p>
                </div>
            </article>
        </div>
    )
}