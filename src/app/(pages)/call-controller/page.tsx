import fetchData from "@/app/utils/fetchData";

import ContentPage from "./ContentPage";

interface Page {
    data: {
        content: [];
    };
}

export default async function PhoneNumber() {
    const page = await fetchData<Page>(`/api/stranicza-vyzov-kontrolyora?populate=*`);
    return (
        <ContentPage data={page.data.content} />
    )
}