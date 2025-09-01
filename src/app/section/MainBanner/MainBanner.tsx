import Image from 'next/image';

import banner from '@/../public/banner.png';
import banner_s from '@/../public/banner_s.png';
import phone from '@/../public/phone.svg';
import { LinkCustom } from '@/app/components';

import styles from './style.module.scss';

export default function News() {
    return (
        <section className={styles.section_banner}>
            <div className={styles.main_banner}>
                <div className={styles.main_banner_small}>
                    <h2>МУП «Находка-Водоканал» — всегда на связи с городом</h2>
                    <p>Передайте показания, оплатите услуги  <br /> и получите поддержку — всё в пару кликов</p>

                    <LinkCustom href={'/transmission-of-readings'} text='Передать показания' />

                    <Image src={banner} className={styles.banner} alt='banner' />
                </div>
                <Image src={banner_s} className={styles.banner_small} alt='banner small' />
            </div>


            <div className={styles.contacts_mobile}>
                <div className={styles.wrapper_contact_info}>
                    <Image src={phone} width={25} height={25} alt="phone" />
                    <div>
                        <p>Для жителей многоквартирных домов</p>
                        <a href="+7 984 195 8355, 745-582">+7 984 195 8355, 745-582</a>
                    </div>
                </div>
                <div className={styles.wrapper_contact_info}>
                    <Image src={phone} width={25} height={25} alt="phone" />
                    <div>
                        <p>Для жителей частного сектора</p>
                        <a href="+7 914 719 6831, 634-132">+7 914 719 6831, 634-132</a>
                    </div>
                </div>
                <div className={styles.wrapper_contact_info}>
                    <Image src={phone} width={25} height={25} alt="phone" />
                    <div>
                        <p>Для юридических лиц</p>
                        <a href="+7 914 716 5619, 744-539">+7 914 716 5619, 744-539</a>
                    </div>
                </div>
            </div>
        </section>
    )
}
