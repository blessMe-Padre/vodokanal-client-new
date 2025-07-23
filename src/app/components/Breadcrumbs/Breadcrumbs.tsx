'use client';
import Link from 'next/link';

import styles from './style.module.scss';

import type { FC } from 'react';



interface BreadcrumbsProps {
    secondLink?: string;
    secondLabel?: string;
    thirdLabel?: string;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ secondLink = '/', secondLabel, thirdLabel }) => {
    return (
        <nav className={styles.breadcrumbs}>
            <ul>
                <li>
                    <Link href="/">Главная</Link>
                </li>
                {secondLabel && (
                    <li>
                        {thirdLabel ? (
                            <Link href={secondLink}>{secondLabel}</Link>
                        ) : (
                            <span className={styles.active}>{secondLabel}</span>
                        )}
                    </li>
                )}
                {thirdLabel && (
                    <li className={styles.active}>{thirdLabel}</li>
                )}
            </ul>
        </nav>
    );
}

export default Breadcrumbs;
