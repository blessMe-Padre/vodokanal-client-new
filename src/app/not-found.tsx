import Link from 'next/link';

import styles from './not-found.module.scss';

export default function NotFound() {
    return (
        <div className='container'>
            <div className={styles.wrapper}>
                <h2 className={styles.title}>404</h2>
                <p className={styles.text}>Страница не найдена, но вы можете воспользоваться поиском по сайту. Просто введите свой запрос в строку поиска — и мы найдёмдля вас полезную информацию.</p>
                <Link href="/" className={styles.link}>На главную</Link>
            </div>
        </div>
    )
}