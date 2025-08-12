import styles from "./style.module.scss";

type DocumentComponentProps = {
    title: string;
    link?: string;
    file?: {
        url: string;
    };
}

export default function DocumentComponent({ title, link }: DocumentComponentProps) {
    return (
        <a href={link} target="_blank" className={styles.document} rel="noopener noreferrer">
            <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.1354 10C19.2708 10 16.9271 7.75 16.9271 5V0H9.11458C6.25 0 3.90625 2.25 3.90625 5V25C3.90625 27.75 6.25 30 9.11458 30H22.1354C25 30 27.3438 27.75 27.3438 25V10H22.1354ZM9.11458 20C9.11458 19.25 9.63542 18.75 10.4167 18.75H15.625C16.4062 18.75 16.9271 19.25 16.9271 20C16.9271 20.75 16.4062 21.25 15.625 21.25H10.4167C9.63542 21.25 9.11458 20.75 9.11458 20ZM20.8333 13.75C21.6146 13.75 22.1354 14.25 22.1354 15C22.1354 15.75 21.6146 16.25 20.8333 16.25H10.4167C9.63542 16.25 9.11458 15.75 9.11458 15C9.11458 14.25 9.63542 13.75 10.4167 13.75H20.8333Z" fill="#1B4965" />
                <path d="M26.8229 7.49988L19.5312 0.499878V4.99988C19.5312 6.37488 20.7031 7.49988 22.1354 7.49988H26.8229Z" fill="#1B4965" />
            </svg>

            <span>{title}</span>
        </a>
    )
}
