'use client';
import { useState } from "react";

import { Breadcrumbs } from "@/app/components";

interface HookProps {
    title: string;
    description: string;
}


const CustomHook = (props: HookProps) => {
    const obj = {
        name: 'John',
        age: 30,
        city: 'New York'
    }

    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
    }

    return (
        <div>
            <h1>{props.title}</h1>
            <p>{props.description}</p>
        </div>
    )
}

export default function Contacts() {
    return (
        <div className="container">
            <Breadcrumbs secondLink="/" secondLabel="Главная" thirdLabel="Контакты" />
            <h1>Contacts</h1>
        </div>
    )
}