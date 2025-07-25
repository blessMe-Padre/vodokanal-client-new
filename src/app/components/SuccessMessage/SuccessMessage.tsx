import styles from './style.module.scss';

export default function SuccessMessage( { text }: { text: string } ) {
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
            <p>{text}</p>
        </div>
    );
}