'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');


    return (
        <div className='container'>
            <h1>Результаты поиска для: {query}</h1>
        </div>
    )
}