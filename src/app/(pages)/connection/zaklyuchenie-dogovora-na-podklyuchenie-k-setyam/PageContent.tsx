'use client'
import { motion } from "framer-motion";
import { useState } from 'react';

import { StatementFormPod, StatementFormLegalPod, StatementFormSelfPod } from "@/app/components";

import styles from "../style.module.scss";

type TabIndex = 0 | 1 | 2;

const PageContent = () => {
    const [activeTab, setActiveTab] = useState<TabIndex>(0);

    const openTab = (e: React.MouseEvent<HTMLLIElement>) => {
        const index = e.currentTarget.getAttribute('data-index');
        if (index !== null) {
            setActiveTab(parseInt(index) as TabIndex);
        }
    };

  

    return (
            <>
                <ul className={styles.list}>
                    <li 
                        className={`${styles.item} ${activeTab === 0 ? styles.item_active : ""}`} 
                        data-index="0" 
                        onClick={openTab}
                    >
                        <span>Заявление для физических лиц и ИЖС</span>
                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                            <path d="M13.8025 6.98638C14.0954 6.69349 14.0954 6.21862 13.8025 5.92572L9.02958 1.15275C8.73668 0.85986 8.26181 0.85986 7.96892 1.15275C7.67602 1.44565 7.67602 1.92052 7.96892 2.21341L12.2116 6.45605L7.96892 10.6987C7.67602 10.9916 7.67602 11.4665 7.96892 11.7594C8.26181 12.0522 8.73668 12.0522 9.02958 11.7594L13.8025 6.98638ZM0.345703 6.45605V7.20605H13.2722V6.45605V5.70605H0.345703V6.45605Z" />
                        </svg>
                    </li>
                    <li 
                        className={`${styles.item} ${activeTab === 1 ? styles.item_active : ""}`} 
                        data-index="1" 
                        onClick={openTab}
                    >
                        <span>Заявление для юридических лиц</span>
                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                            <path d="M13.8025 6.98638C14.0954 6.69349 14.0954 6.21862 13.8025 5.92572L9.02958 1.15275C8.73668 0.85986 8.26181 0.85986 7.96892 1.15275C7.67602 1.44565 7.67602 1.92052 7.96892 2.21341L12.2116 6.45605L7.96892 10.6987C7.67602 10.9916 7.67602 11.4665 7.96892 11.7594C8.26181 12.0522 8.73668 12.0522 9.02958 11.7594L13.8025 6.98638ZM0.345703 6.45605V7.20605H13.2722V6.45605V5.70605H0.345703V6.45605Z" />
                        </svg>
                    </li>
                    <li 
                        className={`${styles.item} ${activeTab === 2 ? styles.item_active : ""}`} 
                        data-index="2" 
                        onClick={openTab}
                    >
                        <span>Для органов власти и самоуправления</span>
                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                            <path d="M13.8025 6.98638C14.0954 6.69349 14.0954 6.21862 13.8025 5.92572L9.02958 1.15275C8.73668 0.85986 8.26181 0.85986 7.96892 1.15275C7.67602 1.44565 7.67602 1.92052 7.96892 2.21341L12.2116 6.45605L7.96892 10.6987C7.67602 10.9916 7.67602 11.4665 7.96892 11.7594C8.26181 12.0522 8.73668 12.0522 9.02958 11.7594L13.8025 6.98638ZM0.345703 6.45605V7.20605H13.2722V6.45605V5.70605H0.345703V6.45605Z" />
                        </svg>
                    </li>
                </ul>

                <div 
                    className={styles['tab-content']} 
                    data-active={activeTab === 0}
                >
                    <StatementFormPod />
                </div>
                <div 
                    className={styles['tab-content']} 
                    data-active={activeTab === 1}
                >
                    <StatementFormLegalPod />
                </div>
            
                <div 
                    className={styles['tab-content']} 
                    data-active={activeTab === 2}
                >
                    <StatementFormSelfPod />
                </div>
        </>
    )
}

export default PageContent;