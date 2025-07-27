'use client';

import { Breadcrumbs } from "@/app/components";

export default function Contacts() {
    return (
        <div className="container">
            <Breadcrumbs secondLink="/" secondLabel="Главная" thirdLabel="Контакты" />
            <h1>Contacts</h1>
        </div>
    )
}