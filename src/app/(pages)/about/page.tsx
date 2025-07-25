import Image from "next/image";

import Breadcrumbs from "@/app/components/Breadcrumbs/Breadcrumbs";
import ContentRenderer from "@/app/components/ContentRenderer/ContentRenderer";
import fetchData from "@/app/utils/fetchData";

import styles from "./style.module.scss";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - О компании',
    description: 'О компании МУП "Находка-Водоканал"',
}

export default async function About() {
    const page = await fetchData(`/api/stranicza-o-kompanii?populate=*`);

    console.log(page);

    return (

        <div className="container">
            <Breadcrumbs thirdLabel="О компании" />
            <h1>О компании</h1>

            <Image
                src={page?.data?.image?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${page.data.image.url}` : '/placeholder.svg'}
                alt={page?.data?.image?.alternativeText ?? 'image'}
                width={page?.data?.image?.width}
                height={page?.data?.image?.height}
                // loading="lazy"
                priority
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MiIgaGVpZ2h0PSIxMTg5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiIC8+PC9zdmc+"
            />

            <ContentRenderer content={page?.data?.content} />

        </div>
    )
}