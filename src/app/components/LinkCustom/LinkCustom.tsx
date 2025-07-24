import Link from "next/link";

import styles from './style.module.scss';

import type { FC, CSSProperties } from 'react';

interface LinkButtonProps {
    href: string;
    text: string;
    style?: string;
    width?: string | number;
}

const LinkCustom: FC<LinkButtonProps> = ({ href, text, style, width }) => {
    const customStyle: CSSProperties = width ? { maxWidth: width } : {};

    return (
        <Link
            style={customStyle}
            className={`${styles.appLink} ${style === 'noBg' ? `${styles.noBg}` : ''}`}
            href={href}
        >
            {text}
        </Link>
    );
}

export default LinkCustom;