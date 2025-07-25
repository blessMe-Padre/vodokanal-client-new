export default async function fetchData(url) {
    const domain = `${process.env.NEXT_PUBLIC_API_SERVER}`;
    try {
        const response = await fetch(domain + url, {
            next: { revalidate: 600 },
        })

        if (!response.ok) {
            throw new Error(`Ошибка http:, ${response.status}`)
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Произошла ошибка', error)
        return [];
    }
}