import Image from "next/image";

import styles from "./style.module.scss";

type DocumentComponentProps = {
    title: string;
    link: string;
}

export default function DocumentComponent({ title, link }: DocumentComponentProps) {
    return (
        <li className={styles.document}>
            <a href={link} target="_blank" rel="noopener noreferrer">
                <Image src="/icons/pdf-icon.svg" alt="PDF" width={24} height={24} />
                <span>{title}</span>
            </a>
        </li>
    )
}
