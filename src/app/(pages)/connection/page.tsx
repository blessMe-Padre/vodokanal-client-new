import Calculator from '@/app/components/Calculator/Calculator';

import styles from './style.module.scss';

export const metadata = {
    title: 'Калькулятор стоимости подключения',
    description: 'Калькулятор осуществляет предварительный неполный расчет, требующий уточнения нашего инженера.',
}

export default function Connection() {
    return (
        <div className="container">
            <h1 className={styles.title}>Калькулятор стоимости подключения</h1>
            <p>Калькулятор осуществляет предварительный неполный расчет, требующий уточнения нашего инженера.</p>

            <Calculator />
        </div>
    )
}