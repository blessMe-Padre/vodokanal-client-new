import styles from './style.module.scss';

interface ButtonProps {
    text: string;
    disabled?: boolean;
    onClick?: () => void;
}

export default function Button({ text, disabled, onClick }: ButtonProps) { 

    return (
        <button className={`${styles.appButton} ${disabled ? 'disabled' : ''}`} disabled={disabled} onClick={onClick}>{text}</button>
    )
}