import Link from "next/link";

import styles from './style.module.scss';

import type { FC, MouseEventHandler, CSSProperties } from 'react';

interface LinkButtonProps {
    href?: string;
    text: string;
    style?: string;
    forClick?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    width?: string | number;
}

const LinkButton: FC<LinkButtonProps> = ({ href = '/', text, style, forClick, onClick, width }) => {
    const customStyle: CSSProperties = width ? { maxWidth: width } : {};

    return (

        forClick === true ?
            (
                <button onClick={onClick} className={`${styles.link}`}>{text}</button>
            )
            :
            (
                <Link
                    style={customStyle}
                    className={`${styles.link} ${style === 'noBg' ? `${styles.noBg}` : ''}`}
                    href={href}>
                    {text}
                </Link>
            )
    )
}

export default LinkButton;