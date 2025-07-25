'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldErrors, FieldValues, useForm, UseFormRegister } from 'react-hook-form';

import { Button } from '@/app/components';

import styles from './styles.module.scss';

interface ComponentFormReadingsProps { 
    setStep: (step: 'phone_number' | 'form_readings') => void;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
    error: string;
    isSending: boolean;
}

interface ComponentPhoneNumberProps { 
  setStep: (step: 'phone_number' | 'form_readings') => void;
  register: ReturnType<typeof useForm>['register'];
  errors: ReturnType<typeof useForm>['formState']['errors'];
}


export default function ContentPage() {
    const router = useRouter();
    const [step, setStep] = useState('phone_number');
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    
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

        try {
            const response = await fetch('/api/send-data-readings', {
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
                <h1 className="title">Передача показаний через сайт</h1>
                <div className="flex flex-col gap-[10px]">
                    {isSuccess ? (
                        <>
                            <SuccessMessage />
                            <Button
                                text="На главную"
                                onClick={() => {
                                    router.push('/');
                                }}
                            />
                        </>
                    ) : (
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            {step === 'phone_number'
                                ?
                                    <ComponentPhoneNumber
                                        setStep={setStep}
                                        register={register}
                                        errors={errors}
                                    />
                                :
                                    <ComponentFormReadings
                                        register={register}
                                        errors={errors}
                                        error={error}
                                        setStep={setStep}
                                        isSending={isSending}
                                    />
                            }
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}


const ComponentPhoneNumber = ({ setStep, register, errors }: ComponentPhoneNumberProps) => {
    const [phone, setPhone] = useState('+7');
    const [touched, setTouched] = useState(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.startsWith('+7') && /^\+7\d{0,10}$/.test(value)) {
            setPhone(value);
            localStorage.setItem('phone', value);
        }

        setTouched(true);
    };

    const handleNext = () => {
        setTouched(true);
    
        if (phone.length === 12) { 
            setStep('form_readings');
        }
    }

    return (
        <>
            <input
                id='phone_number'
                type="tel"
                className="appInput"
                placeholder="+7XXXXXXXXXX"
                value={phone}
                {...register('phone_number', {
                    required: true
                })}
                onChange={handlePhoneChange}
                onBlur={() => setTouched(true)}
            />

            {(errors.phone_number || (touched && phone.length < 12)) && (
                <p className="error">
                {errors?.phone_number?.message?.toString() || 'Номер должен содержать 10 цифр после +7'}
                </p>
            )}

            <Button
                text="Далее"
                disabled={!touched || phone.length !== 12}
                onClick={handleNext}
            />
        </>
    )
}


const ComponentFormReadings = ({ register, errors, error, setStep, isSending }: ComponentFormReadingsProps) => { 
    const individualMeters = [
      { label: '1 - ХВС санузел (показания, куб. м) например: 00120.000', name: 'readings_1_i' },
      { label: '2 - ГВС санузел (показания, куб. м) например: 00120.000', name: 'readings_2_i' },
      { label: '3 - ХВС кухня (показания, куб. м) например: 00120.000', name: 'readings_3_i' },
      { label: '4 - ГВС кухня (показания, куб. м) например: 00120.000', name: 'readings_4_i' },
      { label: '5 - ХВС санузел (показания, куб. м) например: 00120.000', name: 'readings_5_i' },
      { label: '6 - ГВС санузел (показания, куб. м) например: 00120.000', name: 'readings_6_i' },
    ];

    const groupMeters = [
      { label: '7 - ХВС санузел-групповой (показания, куб. м) например: 00120.000', name: 'readings_7_g' },
      { label: '8 - ХВС кухня-групповой (показания, куб. м) например: 00120.000', name: 'readings_8_g' },
      { label: '9 - ГВС санузел-групповой (показания, куб. м) например: 00120.000', name: 'readings_9_g' },
      { label: '10 - ГВС кухня-групповой (показания, куб. м) например: 00120.000', name: 'readings_10_g' },
      { label: '11 - ХВС туалет-групповой (показания, куб. м) например: 00120.000', name: 'readings_11_g' },
      { label: '12 - ХВС ванна, титан-групповой (показания, куб. м) например: 00120.000', name: 'readings_12_g' },
      { label: '14 - ГВС туалет-групповой (показания, куб. м) например: 00120.000', name: 'readings_14_g' },
    ];

    return (
        <>
            <div>
                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <div>
                            <p>Лицевой счет №*</p>
                            <p>Шаблон ввода лицевого счета: «код улицы»-«номер дома»-«номер квартиры» Например: 052-001-025, 052-035а-025, 052-205б-001а, 052-205/1-101/2</p>
                        </div>
                        <div>
                            <p>Фамилия, имя, отчество (нанимателя или собственника)</p>
                        </div>
                        <div>
                            <p>Адрес (улица, дом, квартира)*</p>
                        </div>
                    </div>
                    <div className={styles.form_content_item}>
                        <div>
                            <input type="text" className='appInput' placeholder='' {...register('code_street')} />
                            <input type="text" className='appInput' placeholder='' {...register('house_number')} />
                            <input type="text" className='appInput' placeholder='' {...register('apartment_number')} />
                        </div>
                        <div>
                            <input type="text" className='appInput' placeholder='' {...register('fio')} />  
                        </div>
                        <div>
                            <input type="text" className='appInput' placeholder='...' {...register('address')} />
                        </div>
                    </div>
                </div>
                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <p>Индивидуальные приборы учета воды</p>
                        {individualMeters.map((meter, idx) => (
                            <div key={meter.name} className={styles.form_row}>
                            <label>{meter.label}</label>
                            <input type="text" className='appInput' placeholder='' {...register(meter.name)} />
                          </div>
                        ))}
                    </div>
                </div>
                

                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <p>Водомер скважины для учёта стоков (частный сектор)</p>
                        <div className={styles.form_row}>
                            <label>7 - ХВС скважина (показания, куб. м) например: 00120.000</label>
                            <input type="text" className='appInput' placeholder='' {...register('readings_6_double')} />
                        </div>
                    </div>
                </div> 

                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <p>Общие квартирные приборы учета воды (групповые)</p>
                        {groupMeters.map((meter, idx) => (
                          <div key={meter.name} className={styles.form_row}>
                            <label>{meter.label}</label>
                            <input type="text" className='appInput' placeholder='' {...register(meter.name)} />
                          </div>
                        ))}
                    </div>
                </div>

                <div className={styles.form_content}>
                    Согласно Федеральному закону № 152–ФЗ от 27.07.2006 г. «О персональных данных», я согласен на обработку персональных данных. До моего сведения доведено, что МУП «Находка-Водоканал» гарантирует обработку моих персональных данных в соответствии с действующим законодательством РФ.*
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


const SuccessMessage = () => {
    return (
        <div className={styles.success_message}>
            <div className={styles.success_icon_wrapper}>
                <svg
                    className={styles.success_icon}
                    viewBox="0 0 52 52"
                    width="64" height="64"
                    fill="none"
                >
                    <circle cx="26" cy="26" r="25" stroke="#52c41a" strokeWidth="2" fill="#e6ffed" />
                    <path
                        className={styles.success_check}
                        d="M16 27L24 35L38 19"
                        stroke="#52c41a"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                </svg>
            </div>
            <h2>Данные успешно отправлены!</h2>
            <p>Спасибо! Ваши показания приняты в обработку.</p>
        </div>
    );
}