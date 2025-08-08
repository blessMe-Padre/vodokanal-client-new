'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './style.module.scss';

interface FormData {
    client_name: string;
    client_phone?: string;
    email?: string;
    message?: string;
    date?: string;
}

export default function StatementForm() {
    const [isSending, setIsSending] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();


    const handleFormSubmit = async (formData: FormData) => {
        setIsSending(true);

        const date = new Date().toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        formData = { ...formData, date };

        try {
            const response = await fetch('/api/statement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const contentType = response.headers.get('content-type') || '';

            if (!response.ok) {
                if (contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка сервера');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('ответ от api', data);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';

            console.error('Ошибка при отправке:', errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section>
            <h2>Заявление для физических лиц и ИЖС</h2>

            <div className={styles.statement_page}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <header className={styles.statement_header}>
                        <p className={styles.director}>Директору МУП «Находка-Водоканал» Е.В. Лембет</p>
                        <div className={styles.form_item}>
                            <label htmlFor='client_name'>От:</label>
                            <input
                                id='client_name'
                                type="text"
                                className='appInput'
                                placeholder='Ваше имя'
                                {...register('client_name', { required: 'Имя обязательно для заполнения' })}
                            />
                            {errors.client_name && <span className={styles.error}>{errors.client_name.message}</span>}
                        </div>
                        <div className={styles.form_item}>
                            <label htmlFor='client_phone'>Тел.:</label>
                            <input
                                id='client_phone'
                                type="tel"
                                className='appInput'
                                placeholder=''
                                {...register('client_phone', { required: 'Телефон обязателен для заполнения' })}
                            />
                            {errors.client_phone && <span className={styles.error}>{errors.client_phone.message}</span>}
                        </div>
                    </header>

                    <div className={styles.statement_title}>
                        <h3>ЗАПРОС</h3>
                        <p>о выдаче технических условий на подключение
                            (технологическое присоединение) к централизованным системам
                            холодного водоснабжения и (или) водоотведения</p>
                    </div>

                    <button type="submit" className="appButton appButton--full" disabled={isSending}>
                        {isSending ? (
                            <span className='loader'></span>
                        ) : (
                            'Отправить'
                        )}
                    </button>

                </form>

            </div>
        </section>
    )
}