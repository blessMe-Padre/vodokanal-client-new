'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');


    return (
        <Suspense>
            <div className='container'>
                <h1>Результаты поиска для: {query}</h1>
            </div>
        </Suspense>
    )
}


export default function SearchPage() {
    return (
        <Suspense fallback={<div className='container'><h1>Загрузка результатов поиска...</h1></div>}>
            <SearchResults />
        </Suspense>
    );
}