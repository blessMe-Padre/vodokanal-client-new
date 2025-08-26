'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, useForm, UseFormRegister } from 'react-hook-form';

import { Button, SuccessMessage } from '@/app/components';

import styles from './styles.module.scss';

interface ComponentFormReadingsProps {
    register: UseFormRegister<FieldValues>;
    error: string;
    isSending: boolean;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function ContentPage() {
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const { register, handleSubmit } = useForm();

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

    return (
        <>
            <div className="container">
                <h1 className="title">Вызов контролера</h1>
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
                            <p>При заполнении заявки ВАЖНО правильно выбрать причину вызова контролера.</p>
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
                                />
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

const ComponentFormCallController = ({ register, isSending, error }: ComponentFormReadingsProps) => {
    const data = [
        { label: 'Фамилия, Имя, Отчество (или название компании)*', name: 'call_fio' },
        { label: 'Адрес (улица, дом, квартира)', name: 'call_address' },
        { label: 'Код двери подъезда (при наличии)', name: 'call_code_door' },
        { label: 'Телефон , по которому с вами свяжется контролер*', name: 'call_phone_number' },
        { label: 'E-mail', name: 'call_email' },
    ];

    return (
        <>
            <div>
                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <p className={styles.sub_title}>Причина вызова</p>
                        <div>
                            <p>Причина вызова контролера</p>
                        </div>

                        <div className={styles.form_content_item}>
                            <div>
                                <select className={styles.form_select} {...register('call_reason')}>
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
                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <p className={styles.sub_title}>Индивидуальные приборы учета воды</p>
                        {data.map((i, idx) => {
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

                <div className={styles.form_content}>
                    <p>Согласно Федеральному закону № 152–ФЗ от 27.07.2006 г. «О персональных данных», я согласен на обработку персональных данных. До моего сведения доведено, что МУП «Находка-Водоканал» гарантирует обработку моих персональных данных в соответствии с действующим законодательством РФ.*</p>

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

