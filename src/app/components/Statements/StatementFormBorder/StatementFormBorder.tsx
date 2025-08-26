'use client';

import router from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, SuccessMessage } from '@/app/components';

import styles from './style.module.scss';

interface FormData {
    client_name: string;
    client_phone?: string;
    address?: string;
    full_name?: string;
    client_request?: string;
    object_address?: string;
    object_name?: string;
    power?: string;
    water_drainage?: string;
    firefighting?: string;
    email?: string;
    message?: string;
    date?: string;
    files?: FileList;
}

export default function StatementFormBorder() {
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const [files, setFiles] = useState<File[]>([]);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();


    const handleFormSubmit = async (formData: FormData) => {
        setIsSending(true);
        setError(false);
        const date = new Date().toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'files' && formData[key as keyof FormData]) {
                formDataToSend.append(key, formData[key as keyof FormData] as string);
            }
        });
        formDataToSend.append('date', date);
        // добавляем id формы
        formDataToSend.append('form_name', 'zapros_border');

        files.forEach((file) => {
            formDataToSend.append(`files`, file);
        });

        try {
            const response = await fetch('/api/statement', {
                method: 'POST',
                body: formDataToSend
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
            setError(true);
            console.error('Ошибка при отправке:', errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);

        // Проверка размера каждого файла
        const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert(`Некоторые файлы слишком большие! Максимальный размер — 5 МБ.`);
            return;
        }

        setFiles(prev => {
            const updatedFiles = [...prev, ...newFiles];
            // Обновляем значение в форме
            const dataTransfer = new DataTransfer();
            updatedFiles.forEach(file => dataTransfer.items.add(file));
            setValue("files", dataTransfer.files);
            return updatedFiles;
        });
    };

    const handleRemoveFile = (index: number) => {
        setFiles(prev => {
            const newFiles = prev.filter((_, i) => i !== index);
            // Обновляем значение в форме
            const dataTransfer = new DataTransfer();
            newFiles.forEach(file => dataTransfer.items.add(file));
            setValue("files", dataTransfer.files);
            return newFiles;
        });
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Удаляем все нецифровые символы
        let value = e.target.value.replace(/\D/g, '');

        // Если ввод начинается не с 7, добавляем +7
        if (!value.startsWith('7') && value.length > 0) {
            value = '7' + value;
        }

        // Ограничиваем длину (1 для 7 + 10 цифр)
        if (value.length > 11) {
            value = value.substring(0, 11);
        }

        // Форматируем значение
        if (value.length > 1) {
            e.target.value = `+7${value.substring(1)}`;
        } else if (value.length === 1) {
            e.target.value = '+7';
        } else {
            e.target.value = '';
        }
    };

    return (
        <>
            {
                isSuccess ? (
                    <div className={styles.success_wrapper}>
                        <SuccessMessage text="Спасибо! Ваша заявка принята в обработку." />
                        <Button
                            text="На главную"
                            onClick={() => {
                                router.push('/');
                            }}
                        />
                    </div>
                ) : (
                    <section>
                        <h2>Заявление на акт разграничения</h2>

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
                                            onInput={handlePhoneInput}
                                        />
                                        {errors.client_phone && <span className={styles.error}>{errors.client_phone.message}</span>}
                                    </div>
                                </header>

                                <div className={styles.statement_title}>
                                    <h3>Заявление</h3>
                                    <p>Прошу выдать акт разграничения эксплуатационной и балансовой ответственности сторон по водопроводным и канализационным сетям на них между МУП «Находка  - Водоканал» и абонентом:</p>

                                </div>

                                <div className={styles.form_row}>
                                    <label htmlFor='address'>Прошу выдать технические условия на проектирование узла учета потребляемой объекта:</label>
                                    <div className={styles.input_wrapper}>
                                        <input
                                            id='address'
                                            type="text"
                                            className='appInput'
                                            {...register('address', { required: 'Поле обязательно для заполнения' })}
                                        />
                                        {errors.address && <span className={styles.error}>{errors.address.message}</span>}
                                    </div>
                                    <p className={styles.form_row_description}>(наименование объекта, отдельных зданий, сооружений, помещений в составе объекта)</p>
                                </div>

                                <div className={styles.form_row}>
                                    <label htmlFor='object_address'>Расположенного по адресу:</label>
                                    <div className={styles.input_wrapper}>
                                        <input
                                            id='object_address'
                                            type="text"
                                            className='appInput'
                                            {...register('object_address', { required: 'Поле обязательно для заполнения' })}
                                        />
                                        {errors.object_address && <span className={styles.error}>{errors.object_address.message}</span>}
                                    </div>
                                </div>

                                {/* <div className={styles.form_row}>
                                    <label htmlFor='power'>1. Планируемая величина максимальной необходимой мощности (нагрузки) составляет для потребления холодной</label>
                                    <div className={styles.input_wrapper}>
                                        <input
                                            id='power'
                                            type="text"
                                            className='appInput'
                                            placeholder='м3/сутки'
                                            {...register('power', { required: 'Поле обязательно для заполнения' })}
                                        />
                                        {errors.power && <span className={styles.error}>{errors.power.message}</span>}
                                    </div>
                                </div> */}

                                <div className={styles.form_row}>
                                    <label>Ситуационный план земельного участка (масштаб 1:1000 или 1:2000).
                                        Исполнительная съемка на проложенную сеть (масштаб 1:500).
                                        Согласно Федерального закона №152-ФЗ от 27.07.2006 г. «О персональных
                                        данных».</label>
                                    <div className={styles.input_wrapper}>
                                    </div>
                                </div>

                                <div className={styles.documents}>
                                    <h2>Прикрепить документы</h2>
                                    <div className={styles.documents_wrapper}>
                                        <div className={styles.label_wrapper}>
                                            <label htmlFor='files' className={styles.file_label}>
                                                <svg width="38" height="48" viewBox="0 0 38 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M25.75 0.375364H26.4925C26.9107 0.376455 27.3136 0.532811 27.6231 0.814114L37.0056 9.25161C37.1804 9.40939 37.3203 9.602 37.4162 9.81706C37.5121 10.0321 37.5619 10.2649 37.5625 10.5004H27.4375C26.9899 10.5004 26.5607 10.3226 26.2443 10.0061C25.9278 9.68964 25.75 9.26042 25.75 8.81286V0.375364ZM37.5625 13.8754V42.5629C37.5054 43.952 36.9028 45.2626 35.8856 46.2103C34.8683 47.1581 33.5185 47.6665 32.1288 47.6254H5.87125C4.48154 47.6665 3.13165 47.1581 2.11442 46.2103C1.09718 45.2626 0.494636 43.952 0.4375 42.5629V5.43786C0.494636 4.04872 1.09718 2.73813 2.11442 1.79039C3.13165 0.842654 4.48154 0.334212 5.87125 0.375364H22.375V8.81286C22.375 10.1555 22.9084 11.4432 23.8578 12.3926C24.8072 13.342 26.0948 13.8754 27.4375 13.8754H37.5625ZM25.2606 22.8022L20.1981 17.7397C20.0412 17.5816 19.8546 17.456 19.649 17.3704C19.4433 17.2847 19.2228 17.2406 19 17.2406C18.7772 17.2406 18.5567 17.2847 18.351 17.3704C18.1454 17.456 17.9587 17.5816 17.8019 17.7397L12.7394 22.8022C12.4216 23.12 12.2431 23.551 12.2431 24.0004C12.2431 24.4497 12.4216 24.8807 12.7394 25.1985C13.0571 25.5163 13.4881 25.6948 13.9375 25.6948C14.3869 25.6948 14.8179 25.5163 15.1356 25.1985L17.3125 23.0047V34.1254C17.3125 34.5729 17.4903 35.0021 17.8068 35.3186C18.1232 35.6351 18.5524 35.8129 19 35.8129C19.4476 35.8129 19.8768 35.6351 20.1932 35.3186C20.5097 35.0021 20.6875 34.5729 20.6875 34.1254V23.0047L22.8644 25.1985C23.0213 25.3567 23.2079 25.4822 23.4135 25.5679C23.6192 25.6535 23.8397 25.6976 24.0625 25.6976C24.2853 25.6976 24.5058 25.6535 24.7115 25.5679C24.9171 25.4822 25.1037 25.3567 25.2606 25.1985C25.4188 25.0416 25.5443 24.855 25.63 24.6493C25.7157 24.4437 25.7598 24.2231 25.7598 24.0004C25.7598 23.7776 25.7157 23.557 25.63 23.3514C25.5443 23.1458 25.4188 22.9591 25.2606 22.8022Z" fill="#9AADBB" />
                                                </svg>
                                                <input
                                                    id='files'
                                                    type="file"
                                                    multiple
                                                    className='visually-hidden'
                                                    {...register(`files`)}
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>

                                        <ul className={styles.file_list}>
                                            {files.map((file, index) => (
                                                <li key={index} className={styles.file_item}>
                                                    <span>{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFile(index)}
                                                        className={styles.remove_button}
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="20" height="20" rx="10" fill="#EAF0F3" />
                                                            <path d="M7 7L13.364 13.364" stroke="#1B4965" />
                                                            <path d="M13.3633 7L6.99932 13.364" stroke="#1B4965" />
                                                        </svg>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <button type="submit" className="appButton appButton--full" disabled={isSending}>
                                    {isSending ? (
                                        <span className='loader'></span>
                                    ) : (
                                        'Отправить'
                                    )}
                                </button>

                                {error && <p className='error_message'>Ошибка при отправке формы, попробуйте позже</p>}
                            </form>
                        </div>
                    </section>
                )
            }
        </>
    )
}