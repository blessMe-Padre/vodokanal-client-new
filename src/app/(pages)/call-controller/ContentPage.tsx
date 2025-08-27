'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldErrors, FieldValues, useForm, UseFormRegister } from 'react-hook-form';

import { Button, SuccessMessage } from '@/app/components';

import styles from './styles.module.scss';

interface ComponentFormReadingsProps {
    agreement?: boolean;
    register: UseFormRegister<FieldValues>;
    error: string;
    isSending: boolean;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    setIsDefaultForm: React.Dispatch<React.SetStateAction<boolean>>;
    isDefaultForm: boolean;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRemoveFile: (index: number) => void;
    setValue: (name: string, value: FileList) => void;
    errors: FieldErrors<FieldValues>;
}

export default function ContentPage() {
    const router = useRouter();
    const [isDefaultForm, setIsDefaultForm] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string>('');
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
            const response = await fetch('/api/call-controller', {
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
            setError('');
            setIsSuccess(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(errorMessage);
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

    return (
        <>
            <div className="container">
                <h1 className="title">Вызов контролёра</h1>
                <div className="flex flex-col gap-[10px]">
                    {isSuccess ? (
                        <div className="success_wrapper">
                            <SuccessMessage text="Спасибо! Ваша заявка принята в обработку." />
                            <Button
                                text="На главную"
                                onClick={() => {
                                    router.push('/');
                                }}
                            />
                        </div>
                    ) : (
                        <>

                            <p>Заполните предложенную заявку. В соответствии с законодательством время исполнения заявки - до 1 месяца. Накануне визита контролёр созвонится с вами и согласует время. Также вызвать контролёра вы можете по тел. 8(4236)745582.</p>
                            <p>При заполнении заявки ВАЖНО правильно выбрать причину вызова контролёра.</p>
                            <p>Если требуется внести показания ИПУ на момент установки ОБЯЗАТЕЛЬНО нужно вносить в формате – 5 цифр до точки и 3 цифры после точки. Лидирующие нули и десятичные значения вносить обязательно (например, 00123.059 или 00072.000). Показания, где все восемь цифр - нули, не передаются: даже если вы водомером не пользуетесь, он зафиксировал несколько литров воды при заводской поверке, внесите их значения после пяти нулей и точки.</p>
                            <p>Обратите внимание:</p>

                            <p>- Внимание! Причина вызова «Опломбирование вводов» означает их полное перекрытие! Выбирайте её ТОЛЬКО, КОГДА вы водой по указанному адресу не пользуетесь (В ЖИЛЬЕ НИКТО НЕ ПРОЖИВАЕТ). После опломбирования вам не придётся передавать показания или менять водомер даже с истёкшим МПИ.</p>
                            <p>- Выбирайте причину «ВВОД установленного водомера В ЭКСПЛУАТАЦИЮ», если вы впервые установили водомер или заменили его после окончания МПИ. А также если сорвали пломбу без предварительного вызова контролёра.</p>

                            <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
                                <ComponentFormCallController
                                    register={register}
                                    error={error}
                                    isSending={isSending}
                                    files={files}
                                    setFiles={setFiles}
                                    setIsDefaultForm={setIsDefaultForm}
                                    isDefaultForm={isDefaultForm}
                                    handleFileChange={handleFileChange}
                                    handleRemoveFile={handleRemoveFile}
                                    setValue={setValue}
                                    errors={errors}
                                />
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

const ComponentFormCallController = ({ 
    register,
    isSending,
    error,
    setIsDefaultForm,
    isDefaultForm,
    files,
    errors,
    handleFileChange,
    handleRemoveFile }: ComponentFormReadingsProps) => {
        
    const dataDefault = [
        { label: 'Фамилия, Имя, Отчество (или название компании)*', name: 'call_fio' },
        { label: 'Адрес (улица, дом, квартира)', name: 'call_address' },
        { label: 'Код двери подъезда (при наличии)', name: 'call_code_door' },
        { label: 'Телефон , по которому с вами свяжется контролер*', name: 'call_phone_number' },
        { label: 'E-mail', name: 'call_email' },
    ];
    const dataNotDefault = [
        { label: 'Причина ввода', name: 'call_reason' },
        { label: 'Фамилия, Имя, Отчество (или название компании)*', name: 'call_fio' },
        { label: 'Адрес (улица, дом, квартира)', name: 'call_address' },
        { label: 'Код двери подъезда (при наличии)', name: 'call_code_door' },
        { label: 'Телефон , по которому с вами свяжется контролер*', name: 'call_phone_number' },
        { label: 'E-mail', name: 'call_email' },
        { label: 'Адрес, по которому расположен узел учета*', name: 'call_address_2' },
        { label: 'Предполагаемая дата и время ввода в эксплуатацию узла учета', name: 'date_call' },
        { label: 'Место установки ИПУ*', name: 'ipu_place', placeholder: '(например: кухня, санузел, общий санузел и т.д.)' },
        { label: 'Тип ИПУ*', name: 'ipu_type', placeholder: '(см. в паспорте ИПУ, например, ВСКМ-15, VLF-15U)' },
        { label: 'После повторной установки припломбированной пломбы демонтаж в связи с', name: 'call_after_demount' },
        { label: 'Заводской № ИПУ*', name: 'ipu_number', placeholder: '(см. в паспорте ИПУ)' },
        { label: 'Дата поверки ИПУ*', name: 'date_check_ipu', placeholder: '(см. в паспорте ИПУ)' },
        { label: 'Показания ИПУ*', name: 'ipu_readings', placeholder: '(на момент установки)' },
        { label: 'К письму прилагаю*', name: 'call_attachments', placeholder: '(перечислите названия прикрепленных документов)' },
    ];

    return (
        <>
            <div>
                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <p className={styles.sub_title}>Причина вызова</p>
                        <div>
                            <p>Причина вызова контролёра</p>
                        </div>

                        <div className={styles.form_content_item}>
                            <div>
                                <select
                                    className={styles.form_select}
                                    {...register('call_reason')}
                                    onChange={(e) => {
                                        if (e.target.value === 'Ввод установленного водомера в эксплуатацию') {
                                            setIsDefaultForm(false);
                                        } else {
                                            setIsDefaultForm(true);
                                        }
                                    }}
                                >
                                    <option value="" defaultValue={''}>Выберите причину вызова</option>
                                    <option value="Ввод установленного водомера в эксплуатацию">Ввод установленного водомера в эксплуатацию</option>
                                    <option value="Контрольное снятие показаний водомеров">Контрольное снятие показаний водомеров</option>
                                    <option value="У водомера скоро окончится МПИ">У водомера скоро окончится МПИ</option>
                                    <option value="Водомер вышел из строя">Водомер вышел из строя</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* тело формы по умолчанию */}
                {isDefaultForm ? ( 
                    <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <p className={styles.sub_title}>Индивидуальные приборы учета воды</p>
                        {dataDefault.map((i, idx) => {
                            if (idx !== 1 && idx !== 4) {
                                return (
                                    <div key={idx} className={styles.form_row}>
                                        <label>{i.label}</label>
                                        <input
                                            type="text"
                                            className='appInput'
                                            placeholder='' {...register(i.name)}
                                            required
                                        />
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={idx} className={styles.form_row}>
                                        <label>{i.label}</label>
                                        <input
                                            type="text"
                                            className='appInput'
                                            placeholder='' {...register(i.name)}
                                        />
                                    </div>
                                )
                            }
                        })}
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <p>Ввоод установленного водомера в эксплуатацию</p>
                        <div className={styles.form_content}>
                            <div className={styles.form_content_item}>
                                {dataNotDefault.map((i, idx) => {
                                    if(idx === 0) {
                                        return (
                                            <div key={idx} className={styles.form_row}>
                                                <label>{i.label}</label>
                                                <select
                                                    className="appInput"
                                                    {...register('call_reason')}
                                                >
                                                    <option value="Первично">Первично</option>
                                                    <option value="После поверки/замены в связи с окончанием МПИ">После поверки/замены в связи с окончанием МПИ</option>
                                                    <option value="Для повторной установки демонтированной пломбы">Для повторной установки демонтированной пломбы</option>
                                                    <option value="После замены ИПУ в связи с поломкой водомера">После замены ИПУ в связи с поломкой водомера</option>
                                                </select>
                                            </div>
                                        )
                                    }else{
                                        return (
                                            <div key={idx} className={styles.form_row}>
                                                <label>{i.label}</label>
                                                <input
                                                    type="text"
                                                    className='appInput'
                                                    placeholder={i.placeholder || ''}
                                                    {...register(i.name)}
                                                    required
                                                />
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>

                        <div className={styles.documents}>
                            <h2>Прикрепить документы</h2>
                            <ul className={styles.documents_list}>
                                <li>Копия паспорта на ИПУ*</li>
                                <li>Документ от организации, установившей прибор (При наличии)</li>
                                <li>Документ о прохождении последней поверки прибора учёта (Eсли прибор не новый.)</li>
                            </ul>

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
                    </div>
                )}

                <div className={styles.form_content}>
                    <p>Согласно Федеральному закону № 152–ФЗ от 27.07.2006 г. «О персональных данных», я согласен на обработку персональных данных. До моего сведения доведено, что МУП «Находка-Водоканал» гарантирует обработку моих персональных данных в соответствии с действующим законодательством РФ.*</p>
                </div>

                <div className="agreement">
                    <div className="agreement_wrapper">
                    <input type="checkbox" id="agreement" {...register('agreement', { required: 'Подтвердите согласие с условиями обработки персональных данных' })} />
                        <label htmlFor="agreement">
                            Я согласен с условиями <Link target='_blank' href="/terms-of-service">обработки персональных данных</Link>
                        </label>
                    </div>
                    {errors.agreement && <span className="error_agreement">{errors.agreement.message as string}</span>}
                </div>

                <button type="submit" className='appButton' disabled={isSending}>
                    {isSending ? (
                        <span className='loader'></span>
                    ) : (
                        'Отправить'
                    )}
                </button>

                {error && <p className='error_message'>Ошибка при отправке формы, попробуйте позже</p>}
            </div>
        </>
    )
}

