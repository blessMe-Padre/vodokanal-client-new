import { Breadcrumbs } from "@/app/components";

import styles from "./style.module.scss";

export const metadata = {
    title: 'МУП "Находка-Водоканал" - Реквизиты',
    description: 'Реквизиты МУП "Находка-Водоканал"',
}

export default function Requisites() {
    return (
        <section className={styles.section}>
            <div className="container">
                <Breadcrumbs secondLabel="Реквизиты"/>
                <h1 className='title'>Реквизиты</h1>
                <div className={styles.content}>
                    <div className={styles.infoBlock}>
                        <h2 className={styles.subtitle}>Муниципальное унитарное предприятие «Находка-Водоканал»</h2>
                        
                        {/* <div className={styles.details}>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Юридический адрес:</span>
                                <span className={styles.value}>692900, Приморский край, г. Находка, ул. Владивостокская, 1</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Фактический адрес:</span>
                                <span className={styles.value}>692900, Приморский край, г. Находка, ул. Владивостокская, 1</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>ИНН:</span>
                                <span className={styles.value}>2501001234</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>КПП:</span>
                                <span className={styles.value}>250101001</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>ОГРН:</span>
                                <span className={styles.value}>1022501234567</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>ОКПО:</span>
                                <span className={styles.value}>12345678</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>ОКВЭД:</span>
                                <span className={styles.value}>36.00 - Сбор, очистка и распределение воды</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Расчетный счет:</span>
                                <span className={styles.value}>40702810123456789012</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Банк:</span>
                                <span className={styles.value}>Филиал «Приморский» ПАО «Сбербанк России»</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>БИК:</span>
                                <span className={styles.value}>040507001</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Корр. счет:</span>
                                <span className={styles.value}>301018101000000001</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Телефон:</span>
                                <span className={styles.value}>+7 (4236) 12-34-56</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Email:</span>
                                <span className={styles.value}>info@vodokanal-nakhodka.ru</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Генеральный директор:</span>
                                <span className={styles.value}>Иванов Иван Иванович</span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    )
} 