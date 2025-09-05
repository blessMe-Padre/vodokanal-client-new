import { Breadcrumbs } from "@/app/components";
import fetchData from "@/app/utils/fetchData";

import ContentPage from "./ContentPage";
import styles from "./style.module.scss";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Пользовательское соглашение',
    description: 'Пользовательское соглашение МУП "Находка-Водоканал"',
}

interface Page {
    data: {
        content: [];
    };
}

export default async function TermsOfService() {
    const page = await fetchData<Page>(`/api/stranicza-peredacha-pokazanij-cherez-sajt?populate=*`);
    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Передача показаний через сайт" />
                <ContentPage data={page.data.content} />
            </div>
        </section>
    )
}