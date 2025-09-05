'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/app/components';
import ContentRenderer from '@/app/components/ContentRenderer/ContentRenderer';


export default function ContentPage({ data }: { data: [] }) {
    const router = useRouter();
    const [activeCheckbox, setActiveCheckbox] = useState(false);

    const handleClick = () => {
        setActiveCheckbox(!activeCheckbox);
    }

    return (
        <>
            <div className="container">
                <h1 className="title">Передача показаний через сайт</h1>
                <div className="flex flex-col gap-[10px]">

                    <ContentRenderer content={data} />

                    <div className="checkbox_container">
                        <input type="checkbox" checked={activeCheckbox} onChange={handleClick} />
                        <p>Я согласен с условиями передачи показаний через сайт</p>
                    </div>

                    <Button
                        text="Далее"
                        disabled={!activeCheckbox}
                        onClick={() => {
                            if (activeCheckbox) router.push('/send-data');
                        }}
                    />
                </div>
            </div>
        </>
    );
}