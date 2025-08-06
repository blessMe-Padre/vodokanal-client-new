import Image from "next/image";

import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import ContentRenderer from "@/app/components/ContentRenderer/ContentRenderer";
import Counter from "@/app/components/Counter/Counter";
import fetchData from "@/app/utils/fetchData";

import styles from './style.module.scss';

export const metadata = {
    title: 'МУП "Находка-Водоканал" - О компании',
    description: 'О компании МУП "Находка-Водоканал"',
}

export default async function About() {
    const page = await fetchData(`/api/stranicza-o-kompanii?populate=*`);

    return (

        <div className="container">
            <Breadcrumbs thirdLabel="О компании" />
            <h1 className="visually-hidden">О компании</h1>

            <section className={styles.about_section}>
                <div className={styles.about_section_content}>
                    <h2 className={styles.about_section_title}>Мы обеспечиваем город водой — каждый день, каждый дом</h2>
                    <p><strong>МУП «Находка-Водоканал» — </strong> это стратегически важное предприятие, обеспечивающее бесперебойное водоснабжение и водоотведение для жителей, бизнеса 
                    и социальных объектов города Находка.</p>
                    <p><strong>Наша миссия — </strong> поставлять чистую воду, сохранять природные ресурсы и делать жизнь в городе комфортнее.</p>
                </div>
            </section>

            <section className={styles.counter}>
                <div className={styles.counter_item}>
                    <div className={styles.counter_item_title}>
                        <span>&gt;</span>
                        <Counter endValue={100000} className="increement" />
                    </div>
                    <p>обслуживаем жителей</p>
                </div>
                <div className={styles.counter_item}>
                    <div className={styles.counter_item_title}>
                        <span>&gt;</span>
                        <Counter endValue={400} className="increement" />
                        <span> км</span>
                    </div>
                    <p>протяжённость сетей</p>
                </div>
                <div className={styles.counter_item}>
                    <div className={styles.counter_item_title}>
                        <span>&gt;</span>
                        <Counter endValue={300} className="increement" />
                        <span> ед</span>
                    </div>
                    <p>специалистов в штате</p>
                </div>
            </section>

            <section className={styles.features}>
                <div className='image-wrapper'>
                    <Image
                        src={page?.data?.image?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${page.data.image.url}` : '/placeholder.svg'}
                        alt={page?.data?.image?.alternativeText ?? 'image'}
                        width={page?.data?.image?.width}
                        height={page?.data?.image?.height}
                        loading="lazy"
                        // priority
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MiIgaGVpZ2h0PSIxMTg5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiIC8+PC9zdmc+"
                    />
                </div>
                <div>
                    <ContentRenderer content={page?.data?.content} />
                </div>
            </section>


        </div>
    )
}