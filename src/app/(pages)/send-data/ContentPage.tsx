'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import { FieldErrors, useForm, UseFormRegister, UseFormReturn } from 'react-hook-form';

import { Button, SuccessMessage } from '@/app/components';

import styles from './styles.module.scss';

// Типы для шагов формы
type FormStep = 'phone_number' | 'form_readings';

// Типы для счетчиков
type MeterType = 'individual' | 'group' | 'well';

// Интерфейс для счетчика
interface Meter {
    label: string;
    name: keyof FormData;
    type: MeterType;
}

// Интерфейс для данных формы
interface FormData {
    phone_number: string;
    code_street: string;
    house_number: string;
    apartment_number: string;
    fio: string;
    address: string;
    readings_1_i: string;
    readings_2_i: string;
    readings_3_i: string;
    readings_4_i: string;
    readings_5_i: string;
    readings_6_i: string;
    readings_6_double: string;
    readings_7_g: string;
    readings_8_g: string;
    readings_9_g: string;
    readings_10_g: string;
    readings_11_g: string;
    readings_12_g: string;
    readings_14_g: string;
    date: string;
}

// Интерфейс для ошибок формы
// interface FormErrors extends FieldErrors<FormData> {}

// Интерфейс для состояния полей
interface FieldState {
    [key: string]: boolean;
}

// Интерфейс для значений полей
interface FieldValues {
    [key: string]: string;
}

// Интерфейс для пропсов компонента формы показаний
interface ComponentFormReadingsProps {
    setStep: (step: FormStep) => void;
    register: UseFormRegister<FormData>;
    errors: FieldErrors;
    error: string;
    isSending: boolean;
}

// Интерфейс для пропсов компонента номера телефона
interface ComponentPhoneNumberProps {
    setStep: (step: FormStep) => void;
    register: UseFormRegister<FormData>;
    errors: FieldErrors;
}

// // Интерфейс для ответа API
// interface ApiResponse {
//     message?: string;
//     success?: boolean;
// }

// Интерфейс для ошибки API
interface ApiError {
    message: string;
}

// Тип для функции валидации
type ValidationFunction = (value: string) => boolean;

// Тип для функции изменения поля
type FieldChangeHandler = (fieldName: keyof FormData, value: string) => void;

// Тип для функции потери фокуса поля
type FieldBlurHandler = (fieldName: keyof FormData) => void;

// Тип для функции получения валидации счетчика
type MeterValidationHandler = (meterName: keyof FormData) => boolean;

// Тип для функции получения класса input
type InputClassFunction = (isValid: boolean, isTouched: boolean, baseClass: string) => string;

export default function ContentPage(): React.JSX.Element {
    const router = useRouter();
    const [step, setStep] = useState<FormStep>('phone_number');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const { register, handleSubmit, formState: { errors } }: UseFormReturn<FormData> = useForm<FormData>({
        mode: 'onBlur'
    });

    const handleFormSubmit = async (formData: FormData): Promise<void> => {
        setIsSending(true);
        setError('');
        setIsSuccess(false);

        const date: string = new Date().toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const dataWithDate: FormData = { ...formData, date };

        try {
            const response: Response = await fetch('/api/send-data-readings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataWithDate),
            });

            const contentType: string = response.headers.get('content-type') || '';

            if (!response.ok) {
                if (contentType.includes('application/json')) {
                    const errorData: ApiError = await response.json();
                    throw new Error(errorData.message || 'Ошибка сервера');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setIsSuccess(true);

        } catch (err: unknown) {
            const errorMessage: string = err instanceof Error ? err.message : 'Неизвестная ошибка';
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
                        <div className="success_wrapper">
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


const ComponentPhoneNumber = ({ setStep, register, errors }: ComponentPhoneNumberProps): React.JSX.Element => {
    const [phone, setPhone] = useState<string>('+7');
    const [touched, setTouched] = useState<boolean>(false);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value: string = e.target.value;

        if (value.startsWith('+7') && /^\+7\d{0,10}$/.test(value)) {
            setPhone(value);
            localStorage.setItem('phone', value);
        }

        setTouched(true);
    };

    const handleNext = (): void => {
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
                        validate: (value: string) => {
                            if (value && phone.length !== 12) {
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


const ComponentFormReadings = ({ register, errors, isSending }: ComponentFormReadingsProps): React.JSX.Element => {
    const [touchedFields, setTouchedFields] = useState<FieldState>({});
    const [fieldValues, setFieldValues] = useState<FieldValues>({});

    const handleFieldChange: FieldChangeHandler = (fieldName: keyof FormData, value: string) => {
        setFieldValues(prev => ({ ...prev, [fieldName]: value }));
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    }

    const handleFieldBlur: FieldBlurHandler = (fieldName: keyof FormData) => {
        setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    }

    const getMeterValidation: MeterValidationHandler = (meterName: keyof FormData): boolean => {
        const value: string = fieldValues[meterName] || '';
        return validateMeterReading(value);
    }

    const individualMeters: Meter[] = [
        { label: '1 - ХВС санузел (показания, куб. м) например: 00120.000', name: 'readings_1_i', type: 'individual' },
        { label: '2 - ГВС санузел (показания, куб. м) например: 00120.000', name: 'readings_2_i', type: 'individual' },
        { label: '3 - ХВС кухня (показания, куб. м) например: 00120.000', name: 'readings_3_i', type: 'individual' },
        { label: '4 - ГВС кухня (показания, куб. м) например: 00120.000', name: 'readings_4_i', type: 'individual' },
        { label: '5 - ХВС санузел (показания, куб. м) например: 00120.000', name: 'readings_5_i', type: 'individual' },
        { label: '6 - ГВС санузел (показания, куб. м) например: 00120.000', name: 'readings_6_i', type: 'individual' },
    ];

    const groupMeters: Meter[] = [
        { label: '7 - ХВС санузел-групповой (показания, куб. м) например: 00120.000', name: 'readings_7_g', type: 'group' },
        { label: '8 - ХВС кухня-групповой (показания, куб. м) например: 00120.000', name: 'readings_8_g', type: 'group' },
        { label: '9 - ГВС санузел-групповой (показания, куб. м) например: 00120.000', name: 'readings_9_g', type: 'group' },
        { label: '10 - ГВС кухня-групповой (показания, куб. м) например: 00120.000', name: 'readings_10_g', type: 'group' },
        { label: '11 - ХВС туалет-групповой (показания, куб. м) например: 00120.000', name: 'readings_11_g', type: 'group' },
        { label: '12 - ХВС ванна, титан-групповой (показания, куб. м) например: 00120.000', name: 'readings_12_g', type: 'group' },
        { label: '14 - ГВС туалет-групповой (показания, куб. м) например: 00120.000', name: 'readings_14_g', type: 'group' },
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
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('code_street', e.target.value),
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
                                    placeholder='Номер дома (3 цифры) например: 012'
                                    {...register('house_number', {
                                        required: 'Номер дома обязателен',
                                        pattern: {
                                            value: /^(?=.*\d)(?=.*[а-яА-Я])[\dа-яА-Я\/]{3,}$/i,
                                            message: 'Номер дома может содержать 3 цифры, буквы и символ "/" (например: 012, 012а, 012/1)'
                                        },
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('house_number', e.target.value),
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
                                    placeholder='Номер квартиры (3 цифры) например: 022'
                                    {...register('apartment_number', {
                                        required: 'Номер квартиры обязателен',
                                        pattern: {
                                            value: /^\d{3}$/,
                                            message: 'Номер квартиры должен содержать 3 цифры например: 022'
                                        },
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('apartment_number', e.target.value),
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
                        {individualMeters.map((meter: Meter) => (
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
                                        // required: 'Показания обязательны для заполнения',
                                        validate: (value: string) => {
                                            if (!value) return true;
                                            return /^\d{5}\.\d{3}$/.test(value) || 'Формат: 5 цифр до точки, 3 цифры после (например: 00120.000)';
                                        },
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(meter.name, e.target.value),
                                        onBlur: () => handleFieldBlur(meter.name)
                                    })}
                                />
                                {errors[meter.name as keyof FormData] && <p className="error">{errors[meter.name as keyof FormData]?.message?.toString()}</p>}
                                {touchedFields[meter.name] && !getMeterValidation(meter.name) && fieldValues[meter.name] && !errors[meter.name as keyof FormData] && (
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
                                    // required: 'Показания обязательны для заполнения',
                                    validate: (value: string) => {
                                        if (!value) return true;
                                        return /^\d{5}\.\d{3}$/.test(value) || 'Формат: 5 цифр до точки, 3 цифры после (например: 00120.000)';
                                    },
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('readings_6_double', e.target.value),
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
                        {groupMeters.map((meter: Meter) => (
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
                                        // required: 'Показания обязательны для заполнения',
                                        validate: (value: string) => {
                                            if (!value) return true;
                                            return /^\d{5}\.\d{3}$/.test(value) || 'Формат: 5 цифр до точки, 3 цифры после (например: 00120.000)';
                                        },
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(meter.name, e.target.value),
                                        onBlur: () => handleFieldBlur(meter.name)
                                    })}
                                />
                                {errors[meter.name as keyof FormData] && <p className="error">{errors[meter.name as keyof FormData]?.message?.toString()}</p>}
                                {touchedFields[meter.name] && !getMeterValidation(meter.name) && fieldValues[meter.name] && !errors[meter.name as keyof FormData] && (
                                    <p className="error">Формат: 5 цифр до точки, 3 цифры после (например: 00120.000)</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.form_content}>
                    Согласно Федеральному закону № 152–ФЗ от 27.07.2006 г. «О персональных данных», я согласен на обработку персональных данных. До моего сведения доведено, что МУП «Находка-Водоканал» гарантирует обработку моих персональных данных в соответствии с действующим законодательством РФ.*
                </div>

                <div className={styles.btn_wrapper}>
                    <button type="submit" className='appButton' disabled={isSending}>
                        {isSending ? (
                            <span className='loader'></span>
                        ) : (
                            'Отправить'
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}


// Валидация лицевого счета
// const validateAccountNumber = (code: string, house: string, apartment: string): boolean => {
//     if (!code || !house || !apartment) return false;

//     // Проверяем код улицы (3 цифры)
//     if (!/^\d{3}$/.test(code)) return false;

//     // Проверяем номер дома (может содержать буквы и символы)
//     if (!/^[\dа-яА-Я\/]+$/.test(house)) return false;

//     // Проверяем номер квартиры (может содержать буквы)
//     if (!/^[\dа-яА-Я]+$/.test(apartment)) return false;

//     return true;
// };

const validateMeterReading: ValidationFunction = (value: string): boolean => {
    if (!value) return true;
    return /^\d{5}\.\d{3}$/.test(value);
}


const inputClass: InputClassFunction = (isValid: boolean, isTouched: boolean, baseClass: string): string => {
    if (!isTouched) return baseClass;
    return `${baseClass} ${isValid ? 'valid-input' : 'invalid-input'}`;
} 