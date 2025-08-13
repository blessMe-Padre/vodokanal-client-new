'use client'

import DocumentComponent from "@/app/components/DocumentComponent/DocumentComponent";

import styles from "./style.module.scss";
import { PageContentProps } from "./types";

export default function PageContent({ pageData }: PageContentProps) {
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

            <section className={styles.section_item}>
                <h2>{pageData?.title_3}</h2>
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
