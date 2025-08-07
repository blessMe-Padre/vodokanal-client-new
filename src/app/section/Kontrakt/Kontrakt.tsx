'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react'

import { LinkCustom } from '@/app/components';
import ContentRenderer from '@/app/components/ContentRenderer/ContentRenderer';

import styles from './style.module.scss'

import fetchData from '@/app/utils/fetchData';


interface PaymentItem {
  id: number;
  title: string;
  payment: string;
  [key: string]: unknown;
}

interface ContractItem {
  id: number;
  documentId: string;
  title: string;
  desc: string;
  list_of_payments: PaymentItem[];
  link: string | null;
  img?: {
    url: string;
  };
  [key: string]: unknown;
}

interface ApiResponse {
  data: ContractItem[];
}

export default function Kontrakt() {
    const [kontrakts, setKontrakts] = useState<ContractItem[]>([]);

    useEffect(() => {
        const getContracts = async () => {
            const res = await fetchData<ApiResponse>(`/api/kontrakts?populate=*`)
            setKontrakts(res.data)
        }

        getContracts();
    }, [])

    return (
        <section>
            <div className="container">
                <div className={styles.contract_wrapper}>
                    {kontrakts && kontrakts?.map((item, idx) => {
                        return (
                            <div key={idx} className={styles.contract_item}>
                                <div className={styles.item_top}>
                                    <div className={styles.item_image}>
                                        {item.img?.url && (
                                            <Image src={item?.img?.url ? `${process.env.NEXT_PUBLIC_API_SERVER}${item.img.url}` : '/placeholder.svg'} alt={item.title} width={180} height={250} />
                                        )}
                                    </div>

                                    <ul className={styles.list_of_payments}>
                                        {item.list_of_payments.map((item, idx) => {
                                            return (
                                                <li key={idx} className={styles.item_list}>
                                                    <p className={styles.item_list_payment}>{item.payment}</p>
                                                    <p className={styles.item_list_title}>{item.title}</p>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                   
                                </div>

                                <div className={styles.item_bottom}>
                                    <div className={styles.content_wrapper}>
                                        <h3 className={styles.item_title}>
                                            {item.title}
                                        </h3>

                                        <div className={styles.desc}>
                                            <ContentRenderer content={item?.desc} />
                                        </div>
                                    </div>
                                
                                
                                    <div className={styles.wrapper}>
                                        <LinkCustom 
                                            href={item.link || '/'} 
                                            text='Узнать подробнее'
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}