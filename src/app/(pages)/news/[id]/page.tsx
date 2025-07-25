
import fetchData from "@/app/utils/fetchData";

export default async function Page({ params }: { params: { id: string } }) {
    // const { id } = params;
    const data = await params;
    console.log('data', data);


    // const page = await fetchData(`/api/novostis/${data.id}?populate=*`);


    return (
        <div className="container">
            <h1>News Page</h1>
        </div>
    )
}