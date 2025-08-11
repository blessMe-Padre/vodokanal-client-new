'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldErrors, FieldValues, useForm, UseFormRegister } from 'react-hook-form';

import { Button, SuccessMessage } from '@/app/components';

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

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onBlur'
    });
    
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
                        <div className={styles.success_wrapper}>
                            <SuccessMessage text="Спасибо! Ваши показания приняты в обработку." />
                            <Button
                                text="На главную"
                                onClick={() => {
                                    router.push('/');
                                }}
                            />
                        </div>
                    ) : (
                        <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
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
        <div className={styles.wrapper}>
            <div>
                <input
                    id='phone_number'
                    type="tel"
                    className="appInput"
                    placeholder="+7XXXXXXXXXX"
                    value={phone}
                    {...register('phone_number', {
                        required: 'Номер телефона обязателен',
                        validate: (value) => {
                            if (phone.length !== 12) {
                                return 'Номер должен содержать 10 цифр после +7';
                            }
                            return true;
                        },
                        onChange: handlePhoneChange,
                        onBlur: () => setTouched(true)
                    })}
                />

                    {(errors.phone_number || (touched && phone.length < 12)) && (
                        <p className="error absolute">
                        {errors?.phone_number?.message?.toString() || 'Номер должен содержать 10 цифр после +7'}
                        </p>
                    )}
            </div>

            <Button
                text="Далее"
                disabled={!touched || phone.length !== 12}
                onClick={handleNext}
            />
        </div>
    )
}


const ComponentFormReadings = ({ register, errors, isSending }: ComponentFormReadingsProps) => { 
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});


    const handleFieldChange = (fieldName: string, value: string) => { 
        setFieldValues(prev => ({ ...prev, [fieldName]: value }));
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    }

    const handleFieldBlur = (fieldName: string) => { 
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    }

    const getMeterValidation = (meterName: string) => { 
        const value = fieldValues[meterName] || '';
        return validateMeterReading(value);
    }
    
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
                            <div>Лицевой счет №*</div>
                            <div className={styles.input_row}>
                                <input 
                                    type="text" 
                                    className={inputClass(
                                        /^\d{3}$/.test(fieldValues['code_street'] || ''),
                                        touchedFields['code_street'] || false,
                                        'appInput'
                                    )}
                                    placeholder='Код улицы (3 цифры)' 
                                    {...register('code_street', {
                                        required: 'Код улицы обязателен',
                                        pattern: {
                                            value: /^\d{3}$/,
                                            message: 'Код улицы должен содержать 3 цифры'
                                        },
                                        onChange: (e) => handleFieldChange('code_street', e.target.value),
                                        onBlur: () => handleFieldBlur('code_street')
                                    })}
                                />
                                <input 
                                    type="text" 
                                    className={inputClass(
                                        /^[\dа-яА-Я\/]+$/.test(fieldValues['house_number'] || ''),
                                        touchedFields['house_number'] || false,
                                        'appInput'
                                    )}
                                    placeholder='Номер дома' 
                                    {...register('house_number', {
                                        required: 'Номер дома обязателен',
                                        pattern: {
                                            value: /^[\dа-яА-Я\/]+$/,
                                            message: 'Номер дома может содержать цифры, буквы и символ /'
                                        },
                                        onChange: (e) => handleFieldChange('house_number', e.target.value),
                                        onBlur: () => handleFieldBlur('house_number')
                                    })}
                                />
                                <input 
                                    type="text" 
                                    className={inputClass(
                                        /^[\dа-яА-Я]+$/.test(fieldValues['apartment_number'] || ''),
                                        touchedFields['apartment_number'] || false,
                                        'appInput'
                                    )}
                                    placeholder='Номер квартиры' 
                                    {...register('apartment_number', {
                                        required: 'Номер квартиры обязателен',
                                        pattern: {
                                            value: /^[\dа-яА-Я]+$/,
                                            message: 'Номер квартиры может содержать цифры и буквы'
                                        },
                                        onChange: (e) => handleFieldChange('apartment_number', e.target.value),
                                        onBlur: () => handleFieldBlur('apartment_number')
                                    })}
                                />
                            </div>
                            {errors.code_street && <p className="error">{errors.code_street.message?.toString()}</p>}
                            {errors.house_number && <p className="error">{errors.house_number.message?.toString()}</p>}
                            {errors.apartment_number && <p className="error">{errors.apartment_number.message?.toString()}</p>}
                            <div>Шаблон ввода лицевого счета: «код улицы»-«номер дома»-«номер квартиры» Например: 052-001-025, 052-035а-025, 052-205б-001а, 052-205/1-101/2</div>
                        </div>
                        <div>
                            <p>Фамилия, имя, отчество (нанимателя или собственника)*</p>
                            <input 
                                type="text" 
                                className='appInput' 
                                placeholder='Введите ФИО' 
                                {...register('fio', {
                                    required: 'ФИО обязательно для заполнения'
                                })} 
                            />
                            {errors.fio && <p className="error">{errors.fio.message?.toString()}</p>}
                        </div>
                        <div>
                            <p>Адрес (улица, дом, квартира)*</p>
                            <input 
                                type="text" 
                                className='appInput' 
                                placeholder='Введите адрес' 
                                {...register('address', {
                                    required: 'Адрес обязателен для заполнения'
                                })}
                            />
                            {errors.address && <p className="error">{errors.address.message?.toString()}</p>}
                        </div>
                    </div>
                </div>
                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <p className={styles.sub_title}>Индивидуальные приборы учета воды</p>
                        {individualMeters.map(meter => (
                            <div key={meter.name} className={styles.form_row}>
                                <label>{meter.label}</label>
                                <input 
                                    type="text" 
                                    className={inputClass(
                                        getMeterValidation(meter.name),
                                        touchedFields[meter.name] || false,
                                        'appInput'
                                    )}
                                    placeholder='00000.000' 
                                    {...register(meter.name, {
                                        required: 'Показания обязательны для заполнения',
                                        validate: (value) => {
                                            if (!value) return true;
                                            return /^\d{5}\.\d{3}$/.test(value) || 'Формат: 5 цифр до точки, 3 цифры после (например: 00120.000)';
                                        },
                                        onChange: (e) => handleFieldChange(meter.name, e.target.value),
                                        onBlur: () => handleFieldBlur(meter.name)
                                    })}
                                />
                                {errors[meter.name] && <p className="error">{errors[meter.name]?.message?.toString()}</p>}
                                {touchedFields[meter.name] && !getMeterValidation(meter.name) && fieldValues[meter.name] && !errors[meter.name] && (
                                    <p className="error">Формат: 5 цифр до точки, 3 цифры после (например: 00120.000)</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                

                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <p className={styles.sub_title}>Водомер скважины для учёта стоков (частный сектор)</p>
                        <div className={styles.form_row}>
                            <label>7 - ХВС скважина (показания, куб. м) например: 00120.000</label>
                            <input 
                                type="text" 
                                className={inputClass(
                                    getMeterValidation('readings_6_double'),
                                    touchedFields['readings_6_double'] || false,
                                    'appInput'
                                )}
                                placeholder='00000.000' 
                                {...register('readings_6_double', {
                                    required: 'Показания обязательны для заполнения',
                                    validate: (value) => {
                                        if (!value) return true;
                                        return /^\d{5}\.\d{3}$/.test(value) || 'Формат: 5 цифр до точки, 3 цифры после (например: 00120.000)';
                                    },
                                    onChange: (e) => handleFieldChange('readings_6_double', e.target.value),
                                    onBlur: () => handleFieldBlur('readings_6_double')
                                })}
                            />
                            {errors.readings_6_double && <p className="error">{errors.readings_6_double.message?.toString()}</p>}
                            {touchedFields['readings_6_double'] && !getMeterValidation('readings_6_double') && fieldValues['readings_6_double'] && !errors.readings_6_double && (
                                <p className="error">Формат: 5 цифр до точки, 3 цифры после (например: 00120.000)</p>
                            )}
                        </div>
                    </div>
                </div> 

                <div className={styles.form_content}>
                    <div className={styles.form_content_item}>
                        <p className={styles.sub_title}>Общие квартирные приборы учета воды (групповые)</p>
                        {groupMeters.map(meter => (
                          <div key={meter.name} className={styles.form_row}>
                            <label>{meter.label}</label>
                            <input 
                                type="text" 
                                className={inputClass(
                                    getMeterValidation(meter.name),
                                    touchedFields[meter.name] || false,
                                    'appInput'
                                )}
                                placeholder='00000.000' 
                                {...register(meter.name, {
                                    required: 'Показания обязательны для заполнения',
                                    validate: (value) => {
                                        if (!value) return true;
                                        return /^\d{5}\.\d{3}$/.test(value) || 'Формат: 5 цифр до точки, 3 цифры после (например: 00120.000)';
                                    },
                                    onChange: (e) => handleFieldChange(meter.name, e.target.value),
                                    onBlur: () => handleFieldBlur(meter.name)
                                })}
                            />
                            {errors[meter.name] && <p className="error">{errors[meter.name]?.message?.toString()}</p>}
                            {touchedFields[meter.name] && !getMeterValidation(meter.name) && fieldValues[meter.name] && !errors[meter.name] && (
                                <p className="error">Формат: 5 цифр до точки, 3 цифры после (например: 00120.000)</p>
                            )}
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


// Валидация лицевого счета
// const validateAccountNumber = (code: string, house: string, apartment: string) => {
//     if (!code || !house || !apartment) return false;
    
//     // Проверяем код улицы (3 цифры)
//     if (!/^\d{3}$/.test(code)) return false;
    
//     // Проверяем номер дома (может содержать буквы и символы)
//     if (!/^[\dа-яА-Я\/]+$/.test(house)) return false;
    
//     // Проверяем номер квартиры (может содержать буквы)
//     if (!/^[\dа-яА-Я]+$/.test(apartment)) return false;
    
//     return true;
// };

const validateMeterReading = (value: string) => { 
    if(!value) return true;
    return /^\d{5}\.\d{3}$/.test(value);
}


const inputClass = (isValid: boolean, isTouched: boolean, baseClass: string) => {
    if(!isTouched) return baseClass;
    return `${baseClass} ${isValid ? 'valid-input' : 'invalid-input'}`;
} 