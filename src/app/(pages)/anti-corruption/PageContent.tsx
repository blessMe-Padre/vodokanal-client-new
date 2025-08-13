'use client'
import { useEffect, useState, useRef } from 'react';

import DocumentComponent from "@/app/components/DocumentComponent/DocumentComponent";

import styles from "./style.module.scss";
import { PageContentProps } from "./types";

export default function PageContent({ pageData }: PageContentProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const animateClassName = 'fade-up';


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                    sectionRef.current?.classList.add('active');

                    const animateItem = sectionRef.current?.querySelector('.animate');
                    if (animateItem) {
                        animateItem.classList.add('active');
                    }
             }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, [isVisible]);

    return (
        <>
            <section className={styles.section_item}>
                <h2>{pageData?.title_1}</h2>
                <ul className={styles.documents_list}>
                    {pageData?.documents && pageData?.documents.length > 0 &&
                        pageData.documents.map((document) => (
                            <li key={document?.id}>
                            <DocumentComponent
                                title={document?.title}
                                link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.file?.url}`}
                            />
                            </li>
                        ))}
                </ul>
            </section>

            <section className={styles.section_item}>
                <h2>{pageData?.title_2}</h2>
                <ul className={styles.documents_list}>
                    {pageData?.documents_2 && pageData?.documents_2.length > 0 &&
                        pageData.documents_2.map((document) => (
                            <li key={document?.id}>
                            <DocumentComponent
                                title={document?.title}
                                link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.file?.url}`}
                            />
                            </li>
                        ))}
                </ul>
            </section>

            <section className={styles.section_item} ref={sectionRef}>
                <h2 className='animate fade-up'>{pageData?.title_3}</h2>
                <ul className={styles.documents_list}>
                    {pageData?.documents_3 && pageData?.documents_3.length > 0 &&
                        pageData.documents_3.map((document) => (
                            <li key={document?.id}>
                            <DocumentComponent
                                title={document?.title}
                                link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.file?.url}`}
                            />
                            </li>
                        ))}
                </ul>
            </section>

            <section className={styles.section_item}>
                <h2>{pageData?.title_4}</h2>
                <ul className={styles.documents_list}>
                    {pageData?.documents_4 && pageData?.documents_4.length > 0 &&
                        pageData.documents_4.map((document) => (
                            <li key={document?.id}>
                            <DocumentComponent
                                title={document?.title}
                                link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.file?.url}`}
                            />
                            </li>
                        ))}
                </ul>
            </section>

            <section className={styles.section_item}>
                <h2>{pageData?.title_5}</h2>
                <ul className={styles.documents_list}>
                    {pageData?.documents_5 && pageData?.documents_5.length > 0 &&
                        pageData.documents_5.map((document) => (
                            <li key={document?.id}>
                            <DocumentComponent
                                title={document?.title}
                                link={`${process.env.NEXT_PUBLIC_API_SERVER}${document?.file?.url}`}
                            />
                            </li>
                        ))}
                </ul>
            </section> 
        </>
    )
}
