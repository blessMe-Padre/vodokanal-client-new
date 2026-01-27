'use client';

import { motion } from "framer-motion";
import { useState } from 'react';

import styles from './style.module.scss';

import type { Variants } from "framer-motion";
type TabIndex = 0 | 1;

type TabButton = { title: string };

export default function Calculator() {
    const [activeTab, setActiveTab] = useState<TabIndex>(0);
    const [consumption, setConsumption] = useState(0);
    const [consumptionWater, setConsumptionWater] = useState(0);
    const [length, setLength] = useState(0);
    const [lengthWater, setLengthWater] = useState(0);
    const [diameter, setDiameter] = useState(1);
    const [diameterWater, setDiameterWater] = useState(1);
    const [asphalt, setAsphalt] = useState(false);
    const [asphaltWater, setAsphaltWater] = useState(false);

    const NDC: number = 0.22; // 22% НДС
    const bazovayStoimost: number = 670; // Водоснабжение: 0,670 тыс. руб/куб.м в сутки
    const bazovayStoimostWater: number = 704; // Водоотведение: 0,704 тыс. руб/куб.м в сутки
    type WaterSupplyDiameter = { name: string; withoutAsphalt: number; withAsphalt: number };
    const waterSupplyDiameters: WaterSupplyDiameter[] = [
        { name: 'До 110 мм.', withoutAsphalt: 8119.79, withAsphalt: 9282.83 },
        { name: 'От 125 до 160 мм.', withoutAsphalt: 8984.57, withAsphalt: 9245.88 },
        { name: 'От 160 до 200 мм.', withoutAsphalt: 9282.83, withAsphalt: 10111.56 },
    ];
    const waterDisposalDiameters: WaterSupplyDiameter[] = [
        { name: 'До 160 мм.', withoutAsphalt: 8511.82, withAsphalt: 8997.44 },
        { name: 'От 160 до 200 мм.', withoutAsphalt: 10355.67, withAsphalt: 13157.74 },
    ];

    const getDiameterName = (diam: number, isWater: boolean = false): string => {
        if (isWater) {
            const d = waterDisposalDiameters[diam - 1];
            return d ? d.name : '';
        }
        const d = waterSupplyDiameters[diam - 1];
        return d ? d.name : '';
    };

    const getWaterSupplyTariff = (diam: number): number => {
        const d = waterSupplyDiameters[diam - 1];
        if (!d) return 0;
        return asphalt ? d.withAsphalt : d.withoutAsphalt;
    };

    const getWaterDisposalTariff = (diam: number): number => {
        const d = waterDisposalDiameters[diam - 1];
        if (!d) return 0;
        return asphaltWater ? d.withAsphalt : d.withoutAsphalt;
    };

    const calcNetwork = () => {
        if (diameter < 1 || diameter > 3) return { networkCost: 0, asphaltCost: 0, total: 0 };

        const tariff = getWaterSupplyTariff(diameter);
        const networkCost = length * tariff;

        return {
            networkCost,
            asphaltCost: 0,
            total: networkCost
        };
    };

    const calcNetworkWater = () => {
        if (diameterWater < 1 || diameterWater > 2) return { networkCost: 0, asphaltCost: 0, total: 0 };

        const tariff = getWaterDisposalTariff(diameterWater);
        const networkCost = lengthWater * tariff;

        return {
            networkCost,
            asphaltCost: 0,
            total: networkCost
        };
    };

    // Расчет стоимости водоснабжения
    const totalConsumption: number = consumption * bazovayStoimost;
    const totalConsumptionNDC: number = Math.round(totalConsumption * (1 + NDC));
    const networkData = calcNetwork();
    const network: number = networkData && typeof networkData === 'object' ? networkData.total : 0;
    const networkNDC: number = Math.round(network * (1 + NDC));
    const total: number = totalConsumption + network;
    const totalNDC: number = Math.round(total * (1 + NDC));

    // Расчет стоимости водоотведения
    const totalConsumptionWater: number = consumptionWater * bazovayStoimostWater;
    const totalConsumptionWaterNDC: number = Math.round(totalConsumptionWater * (1 + NDC));
    const networkWaterData = calcNetworkWater();
    const networkWater: number = networkWaterData && typeof networkWaterData === 'object' ? networkWaterData.total : 0;
    const networkWaterNDC: number = Math.round(networkWater * (1 + NDC));
    const totalWater: number = totalConsumptionWater + networkWater;
    const totalWaterNDC: number = Math.round(totalWater * (1 + NDC));

    const openTab = (e: React.MouseEvent<HTMLButtonElement>) => setActiveTab(+e.currentTarget.dataset.index! as TabIndex);

    const tabsButton: TabButton[] = [
        { title: 'Водоснабжение' },
        { title: 'Водоотведение' }
    ]

    const variants: Variants = {
        visible: {
            opacity: 1,
            height: "auto",
            visibility: 'visible',
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        hidden: {
            opacity: 0,
            height: 0,
            visibility: 'hidden',
        },
    };

    return (
        <div className={styles.tabs}>
            <div className={styles.header}>
                <h2 className={styles.title}>Калькулятор стоимости подключения</h2>
                <p>Калькулятор осуществляет предварительный неполный расчет, требующий уточнения нашего инженера.</p>
            </div>

            <div className={styles.tabs_header}>
                {tabsButton.map((item, index) => (
                    <button
                        key={index}
                        className={`${styles.tabButton} ${activeTab === index ? styles.tabButton_active : ''}`}
                        data-index={index}
                        onClick={openTab}
                    >
                        {item.title}
                    </button>
                ))}
            </div>

            <motion.div
                layout
                variants={variants}
                initial="hidden"
                animate={activeTab === 0 ? "visible" : "hidden"}
            >
                <div className={styles.tab_item}>
                    <h2>Расчет подключения водоснабжения</h2>
                    <div className={styles.tab_item_inner}>
                        <div>
                            <h3>Подключение</h3>
                            <div className={styles.input_wrapper}>
                                <label htmlFor="consumption">Предполагаемый расход (кубометров в сутки):</label>
                                <input type="number" id="consumption" value={consumption} onChange={e => setConsumption(+e.target.value)} placeholder="" />
                            </div>
                        </div>

                        <div>
                            <h3>Прокладка сети</h3>
                            <div className={styles.tab_item_row}>
                                <div className={styles.input_group}>
                                    <div className={styles.input_wrapper}>
                                        <label htmlFor="length">Предполагаемая длина сети (метров):</label>
                                        <input type="number" id="length" value={length} onChange={e => setLength(+e.target.value)} />
                                    </div>
                                </div>

                                <div className={styles.input_wrapper}>
                                    <label htmlFor="diameter">Предполагаемый диаметр cети (мм.):</label>
                                    <select name="" id="diameter" value={diameter} onChange={e => setDiameter(+e.target.value)}>
                                        <option value="1">До 110 мм.</option>
                                        <option value="2">От 125 до 160 мм.</option>
                                        <option value="3">От 160 до 200 мм.</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.diameter_info}>
                                <p><strong>Выбранный диаметр:</strong> {getDiameterName(diameter)}</p>
                                <p><strong>Тариф:</strong> {getWaterSupplyTariff(diameter)} тыс. руб/км{asphalt ? ' (с восстановлением асфальта)' : ''}</p>
                            </div>
                        </div>

                        <div className={styles.input_checkbox_wrapper}>
                            <input type="checkbox" id="asphalt" value="20000" name="asphalt" checked={asphalt} onChange={e => setAsphalt(e.target.checked)} />
                            <label htmlFor="asphalt">Учитывать работы по восстановлению асфальтового покрытия</label>
                        </div>
                    </div>

                    <div className={styles.result}>
                        <div className={styles.result_table}>
                            <div className={styles.result_total}>
                                <h3>Расчеты </h3>
                                <p>Подключение: <span>{totalConsumptionNDC.toFixed(2)}</span></p>
                                <p>Сеть: <span>{networkNDC.toFixed(2)}</span></p>
                                <p>Итого: <span>{totalNDC.toFixed(2)}</span></p>
                            </div>
                            <div className={styles.result_cost}>
                                <h2>Расчетная стоимость</h2>
                                <div className={styles.result_inner}>
                                    <div className={styles.result_inner_item}>
                                        <h3>Без НДС, руб</h3>
                                        <p>{totalConsumption.toFixed(2)}</p>
                                        <p>{network.toFixed(2)}</p>
                                        <p>{total.toFixed(2)}</p>
                                    </div>
                                    <div className={styles.result_inner_item}>
                                        <h3>С НДС, руб</h3>
                                        <p>{totalConsumptionNDC.toFixed(2)}</p>
                                        <p>{networkNDC.toFixed(2)}</p>
                                        <p>{totalNDC.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Детализация расчета сети */}
                        <div className={styles.detailed_calculation}>
                            <h3>Детализация расчета сети</h3>
                            <div className={styles.calculation_details}>
                                <p><strong>Длина сети:</strong> {length} м</p>
                                <p><strong>Диаметр:</strong> {getDiameterName(diameter)}</p>
                                <p><strong>Стоимость прокладки сети:</strong> {networkData && typeof networkData === 'object' ? networkData.networkCost.toFixed(2) : '0.00'} руб</p>
                                {asphalt && (
                                    <p><strong>Стоимость восстановления асфальта:</strong> {networkData && typeof networkData === 'object' ? networkData.asphaltCost.toFixed(2) : '0.00'} руб</p>
                                )}
                                <p><strong>Общая стоимость сети:</strong> {networkData && typeof networkData === 'object' ? networkData.total.toFixed(2) : '0.00'} руб</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                layout
                variants={variants}
                initial="hidden"
                animate={activeTab === 1 ? "visible" : "hidden"}
            >
                <div className={styles.tab_item}>
                    <h2>Расчет водоотведение</h2>
                    <div className={styles.tab_item_inner}>
                        <div>
                            <h3>Подключение</h3>
                            <div className={styles.input_wrapper}>
                                <label htmlFor="consumptionWater">Предполагаемый расход (кубометров в сутки):</label>
                                <input type="number" id="consumptionWater" value={consumptionWater} onChange={e => setConsumptionWater(+e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <h3>Прокладка сети</h3>
                            <div className={styles.tab_item_row}>
                                <div className={styles.input_group}>
                                    <div className={styles.input_wrapper}>
                                        <label htmlFor="lengthWater">Предполагаемая длина сети (метров):</label>
                                        <input type="number" id="lengthWater" value={lengthWater} onChange={e => setLengthWater(+e.target.value)} />
                                    </div>
                                </div>

                                <div className={styles.input_wrapper}>
                                    <label htmlFor="diameterWater">Предполагаемый диаметр cети (мм.):</label>
                                    <select name="" id="diameterWater" value={diameterWater} onChange={e => setDiameterWater(+e.target.value)}>
                                        <option value="1">До 160 мм.</option>
                                        <option value="2">От 160 до 200 мм.</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.diameter_info}>
                                <p><strong>Выбранный диаметр:</strong> {getDiameterName(diameterWater, true)}</p>
                                <p><strong>Тариф:</strong> {getWaterDisposalTariff(diameterWater)} тыс. руб/км{asphaltWater ? ' (с восстановлением асфальта)' : ''}</p>
                            </div>
                        </div>

                        <div className={styles.input_checkbox_wrapper}>
                            <input type="checkbox" id="asphaltWater" value="20000" name="asphaltWater" checked={asphaltWater} onChange={e => setAsphaltWater(e.target.checked)} />
                            <label htmlFor="asphaltWater">Учитывать работы по восстановлению асфальтового покрытия</label>
                        </div>
                    </div>

                    <div className={styles.result}>
                        <div className={styles.result_table}>
                            <div className={styles.result_total}>
                                <h3>Общая стоимость с НДС </h3>
                                <p>Подключение: <span>{totalConsumptionWaterNDC.toFixed(2)}</span></p>
                                <p>Сеть: <span>{networkWaterNDC.toFixed(2)}</span></p>
                                <p>Итого: <span>{totalWaterNDC.toFixed(2)}</span></p>
                            </div>
                            <div className={styles.result_cost}>
                                <h2>Расчетная стоимость</h2>
                                <div className={styles.result_inner}>
                                    <div className={styles.result_inner_item}>
                                        <h3>Без НДС, руб</h3>
                                        <p>{totalConsumptionWater.toFixed(2)}</p>
                                        <p>{networkWater.toFixed(2)}</p>
                                        <p>{totalWater.toFixed(2)}</p>
                                    </div>
                                    <div className={styles.result_inner_item}>
                                        <h3>С НДС, руб</h3>
                                        <p>{totalConsumptionWaterNDC.toFixed(2)}</p>
                                        <p>{networkWaterNDC.toFixed(2)}</p>
                                        <p>{totalWaterNDC.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Детализация расчета сети */}
                        <div className={styles.detailed_calculation}>
                            <h3>Детализация расчета сети без НДС</h3>
                            <div className={styles.calculation_details}>
                                <p><strong>Длина сети:</strong> {lengthWater} м</p>
                                <p><strong>Диаметр:</strong> {getDiameterName(diameterWater, true)}</p>
                                <p><strong>Общая стоимость сети:</strong> {networkWaterData && typeof networkWaterData === 'object' ? networkWaterData.total.toFixed(2) : '0.00'} руб</p>
                            </div>
                        </div>
                    </div>

                </div>



            </motion.div >
        </div >
    )
}

// totalConsumptionWater
// totalConsumptionWaterNDC
// networkWater
// networkWaterNDC
// totalWater
// totalWaterNDC
