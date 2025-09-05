import Link from "next/link";

import styles from './style.module.scss';

import type { FC, CSSProperties } from 'react';

interface LinkButtonProps {
    href: string;
    text: string;
    style?: string;
    width?: string | number;
    target?: boolean;
}

const LinkCustom: FC<LinkButtonProps> = ({ href, text, target = true, style, width }) => {
    const customStyle: CSSProperties = width ? { maxWidth: width } : {};

    return (
        <Link
            style={customStyle}
            className={`${styles.appLink} ${style === 'noBg' ? `${styles.noBg}` : ''}`}
            href={href}
            target={target ? '_blank' : '_self'}
        >
            {text}
        </Link>
    );
}

export default LinkCustom;