import { Breadcrumbs } from "@/app/components";

import styles from "./style.module.scss";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Политика конфиденциальности',
    description: 'Политика конфиденциальности МУП "Находка-Водоканал"',
}

export default function PrivacyPolicy() {
    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Политика конфиденциальности"/>
                <h1 className='title'>Политика конфиденциальности</h1>
                
                <div className={styles.content}>
                    <div className={styles.section}>
                        <h2 className={styles.subtitle}>1. Общие положения</h2>
                        <p className={styles.text}>
                            Настоящая Политика конфиденциальности (далее — Политика) определяет порядок обработки 
                            персональных данных пользователей сайта МУП «Находка-Водоканал» (далее — Сайт).
                        </p>
                        <p className={styles.text}>
                            Использование Сайта означает согласие Пользователя с настоящей Политикой и условиями 
                            обработки его персональных данных.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.subtitle}>2. Сбор персональных данных</h2>
                        <p className={styles.text}>
                            Мы собираем следующие виды персональных данных:
                        </p>
                        <ul className={styles.list}>
                            <li>Фамилия, имя, отчество</li>
                            <li>Контактный телефон</li>
                            <li>Адрес электронной почты</li>
                            <li>Адрес проживания</li>
                            <li>Номер лицевого счета</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.subtitle}>3. Цели обработки персональных данных</h2>
                        <p className={styles.text}>
                            Персональные данные обрабатываются в следующих целях:
                        </p>
                        <ul className={styles.list}>
                            <li>Предоставление услуг водоснабжения и водоотведения</li>
                            <li>Обработка заявок и обращений пользователей</li>
                            <li>Информирование о состоянии лицевого счета</li>
                            <li>Улучшение качества предоставляемых услуг</li>
                            <li>Выполнение требований законодательства</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.subtitle}>4. Меры защиты персональных данных</h2>
                        <p className={styles.text}>
                            Мы принимаем необходимые и достаточные правовые, организационные и технические меры 
                            для защиты персональных данных от неправомерного или случайного доступа, уничтожения, 
                            изменения, блокирования, копирования, предоставления, распространения, а также от иных 
                            неправомерных действий в отношении персональных данных.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.subtitle}>5. Права субъектов персональных данных</h2>
                        <p className={styles.text}>
                            Субъект персональных данных имеет право:
                        </p>
                        <ul className={styles.list}>
                            <li>Получать информацию, касающуюся обработки его персональных данных</li>
                            <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
                            <li>Отзывать согласие на обработку персональных данных</li>
                            <li>Обжаловать действия или бездействие при обработке персональных данных</li>
                        </ul>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.subtitle}>6. Контактная информация</h2>
                        <p className={styles.text}>
                            По всем вопросам, связанным с обработкой персональных данных, вы можете обращаться:
                        </p>
                        <div className={styles.contactInfo}>
                            <p><strong>Адрес:</strong> 692900, Приморский край, г. Находка, ул. Владивостокская, 1</p>
                            <p><strong>Телефон:</strong> +7 (4236) 12-34-56</p>
                            <p><strong>Email:</strong> privacy@vodokanal-nakhodka.ru</p>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.subtitle}>7. Изменения в Политике конфиденциальности</h2>
                        <p className={styles.text}>
                            Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. 
                            При внесении изменений в актуальной редакции указывается дата последнего обновления. 
                            Новая редакция Политики вступает в силу с момента ее размещения на Сайте.
                        </p>
                    </div>

                    <div className={styles.footer}>
                        <p className={styles.date}>Дата последнего обновления: 01.01.2024</p>
                    </div>
                </div>
            </div>
        </section>
    )
} 