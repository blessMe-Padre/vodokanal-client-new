import { Breadcrumbs } from "@/app/components";

import styles from "../style.module.scss";

import PageContent from "./PageContent";



export const metadata = {
    title: 'МУП "Находка-Водоканал" - Запрос на технические условия',
    description: 'Запрос на технические условия МУП "Находка-Водоканал"',
}

export default async function page() {
    return (
        <div className="container">
            <Breadcrumbs
                secondLabel="Подключение к сетям"
                secondLink='/connection'
                thirdLabel="Запрос на технические условия"
            />
            <h1 className='title'>Запрос на технические условия</h1>

            <PageContent />
        </div>
    )
} 