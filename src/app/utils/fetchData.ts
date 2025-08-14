export default async function fetchData<T = unknown>(url: string): Promise<T> {
    const domain = `${process.env.NEXT_PUBLIC_API_SERVER}`;
    try {
        const response = await fetch(domain + url, {
            next: { revalidate: 600 },
        })

        if (!response.ok) {
            throw new Error(`Ошибка http: ${response.status}`)
        }
        const result = await response.json() as T; // Type assertion
        return result;
    } catch (error) {
        console.error('Произошла ошибка', error);
        throw error;
    }
}