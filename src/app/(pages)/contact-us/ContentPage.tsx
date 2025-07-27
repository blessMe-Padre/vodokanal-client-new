'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldErrors, FieldValues, useForm, UseFormRegister } from 'react-hook-form';

import { Button, SuccessMessage } from '@/app/components';

import styles from './styles.module.scss';

interface ComponentFormReadingsProps { 
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
    error: string;
    isSending: boolean;
}

export default function ContentPage() {
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');


    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const handleFormSubmit = async (formData: FieldValues) => {
        setIsSending(true);
        setError('');
        setIsSuccess(false);

        const date = new Date().toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        formData = { ...formData, date };
        console.log(formData);

        try {
            const response = await fetch('/api/contact-us', {
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
            
            setIsSuccess(true);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(errorMessage);
            console.error('Ошибка при отправке:', errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <div className="container">
                <h1 className="title">Обращение в водоканал</h1>
                <div className="flex flex-col gap-[10px]">
                    {isSuccess ? (
                        <>
                            <SuccessMessage text="Спасибо! Ваша заявка принята в обработку." />
                            <Button
                                text="На главную"
                                onClick={() => {
                                    router.push('/');
                                }}
                            />
                        </>
                    ) : (
                        <>
                        
                            <form onSubmit={handleSubmit(handleFormSubmit)}>
                                <ComponentFormContactUs
                                    register={register}
                                    errors={errors}
                                    error={error}
                                    isSending={isSending}
                                    />
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

const ComponentFormContactUs = ({ register, isSending }: ComponentFormReadingsProps) => { 
    const data = [
      { label: '1. Фамилия имя отчество*', name: 'contact_fio' },
      { label: '2. Адрес проживания*', name: 'contact_address' },
      { label: '3. Номер телефона*', name: 'contact_code_door' },
      { label: '4. Email*', name: 'contact_phone_number' },
      { label: '5. Описание проблемы*', name: 'contact_email' },
    ];



    return (
        <>
            <div>
                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        {data.map(i => (
                            <div key={i.name} className={styles.form_row}>
                            <label>{i.label}</label>
                            <input type="text" className='appInput' placeholder='' {...register(i.name)} required />
                          </div>
                        ))}
                    </div>
                </div>

                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                    <p>Приложения</p>
                    <p>Если требуется прикрепить дополнительные файлы, воспользуйтесь формой ниже</p>
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className={styles.form_row}>
                            <label>{`Файл ${idx + 1}`}</label>
                            <input
                                type="file"
                                className="appInput"
                                {...register(`file_${idx + 1}`)}
                                onChange={e => {
                                const file = e.target.files?.[0];
                                if (file && file.size > 5 * 1024 * 1024) {
                                    alert('Файл слишком большой! Максимальный размер — 5 МБ.');
                                    e.target.value = '';
                                }
                                }}
                            />
                        </div>
                        ))}
                    </div>
                </div>


                <button type="submit" className='appButton' disabled={isSending}>
                    {isSending ? (
                        <span className='loader'></span>
                    ) : (
                        'Отправить'
                    )}
                </button>
            </div>
        </>
    )
}

