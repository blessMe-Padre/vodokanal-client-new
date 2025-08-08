'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldErrors, FieldValues, useForm, UseFormRegister, UseFormSetValue } from 'react-hook-form';

import { Button, SuccessMessage } from '@/app/components';

import styles from './styles.module.scss';

interface ComponentFormReadingsProps {
    register: UseFormRegister<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
    errors: FieldErrors<FieldValues>;
    error: string;
    isSending: boolean;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function ContentPage() {
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const handleFormSubmit = async (formData: FieldValues) => {
        setIsSending(true);
        setError('');
        setIsSuccess(false);

        const date = new Date().toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'files' && formData[key as keyof FieldValues]) {
                formDataToSend.append(key, formData[key as keyof FieldValues] as string);
            }
        });
        formDataToSend.append('date', date);

        // Добавляем файлы в FormData
        files.forEach((file) => {
            formDataToSend.append('files', file);
        });

        try {
            const response = await fetch('/api/contact-us', {
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

            // const data = await response.json();
            // console.log('ответ от api', data);

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
        <div className="container">
            <h1 className={styles.title}>Обращение в водоканал</h1>
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
                                setValue={setValue}
                                errors={errors}
                                error={error}
                                isSending={isSending}
                                files={files}
                                setFiles={setFiles}
                            />
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

const ComponentFormContactUs = ({ register, setValue, isSending, files, setFiles }: ComponentFormReadingsProps) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);

        // Проверка размера каждого файла
        const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert(`Некоторые файлы слишком большие! Максимальный размер — 5 МБ.`);
            return;
        }

        setFiles((prev: File[]) => [...prev, ...newFiles]);
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prev: File[]) => prev.filter((_: File, i: number) => i !== index));
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

    const data = [
        { label: 'ФИО*', name: 'contact_fio', type: 'text' },
        { label: 'Адрес проживания*', name: 'contact_address', type: 'text' },
        { label: 'Номер телефона*', name: 'contact_phone_number', type: 'tel', onInput: handlePhoneInput },
        { label: 'Email*', name: 'contact_email', type: 'email' },
        { label: 'Описание проблемы*', name: 'contact_message', type: 'text' },
    ];


    return (
        <>
            <div className={styles.form_wrapper}>
                <div className={styles.form_content}>
                    <h2>Личные данные</h2>
                    <div className={styles.form_content_item}>
                        {data.map(i => (
                            <div key={i.name} className={styles.form_row}>
                                <label>{i.label}</label>
                                <input
                                    type={i.type}
                                    className='appInput'
                                    placeholder='' {...register(i.name)}
                                    required
                                    onInput={i.onInput}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <h2>Приложения</h2>
                        <p>Если требуется прикрепить дополнительные файлы, воспользуйтесь формой ниже</p>

                        <div className={styles.form_row}>
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
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
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
                        <div className="button-container">
                            <button type="submit" className="appButton appButton--full" disabled={isSending}>
                                {isSending ? (
                                    <span className='loader'></span>
                                ) : (
                                    'Отправить'
                                )}
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

