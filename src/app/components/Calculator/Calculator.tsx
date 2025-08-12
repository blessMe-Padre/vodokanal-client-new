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
    const [diameter, setDiameter] = useState(0);
    const [asphalt, setAsphalt] = useState(false);

    // Примерные тарифы (можно заменить на реальные)
    const bazovayStoimost: number = 1600; // Предполагаемый расход (кубометров в сутки): на 1 кубометр в сутки
    const bazovayStoimostWater: number = 1082; // Предполагаемый расход (кубометров в сутки): на 1 кубометр в сутки
    const diametrSety: number[] = [
        5500, // До 100 мм.
        6000, // От 100 до 125 мм.
        6500, // От 125 до 150 мм.
    ];
    const diametrSetyWater: number[] = [
        6340, // До 160 мм.
    ];
    const asphaltStoimost: number = 1700;
    const NDC: number = 0.2; // 20% НДС

    // Расчет стоимости
    const calcNetwork = () => {
        if (diameter === 0) return 0;
        let base = length * diametrSety[diameter - 1];

        if (asphalt) base += asphaltStoimost * length;
        return base;
    };

    // Расчет стоимости
    const calcNetworkWater = () => {
        if (diameter === 0) return 0;
        let base = length * diametrSetyWater[diameter - 1];

        if (asphalt) base += asphaltStoimost * length;
        return base;
    };

    // Расчет стоимости водоснабжения
    const totalConsumption: number = consumption * bazovayStoimost;
    const totalConsumptionNDC: number = Math.round(totalConsumption * (1 + NDC));
    const network: number = calcNetwork();
    const networkNDC: number = Math.round(network * (1 + NDC));
    const total: number = totalConsumption + network;
    const totalNDC: number = Math.round(total * (1 + NDC));

    // Расчет стоимости водоотведения
    const totalConsumptionWater: number = consumptionWater * bazovayStoimostWater;
    const totalConsumptionWaterNDC: number = Math.round(totalConsumptionWater * (1 + NDC));
    const networkWater: number = calcNetworkWater();
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
                                        <option value="0">- Выбирите диаметр -</option>
                                        <option value="1">До 100 мм.</option>
                                        <option value="2">От 100 до 125 мм.</option>
                                        <option value="3">От 125 до 150 мм.</option>
                                    </select>
                                </div>
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
                                <p>Подключение: <span>{totalConsumptionNDC.toLocaleString()}</span></p>
                                <p>Сеть: <span>{networkNDC.toLocaleString()}</span></p>
                                <p>Итого: <span>{totalNDC.toLocaleString()}</span></p>
                            </div>
                            <div className={styles.result_cost}>
                                <h2>Расчетная стоимость</h2>
                                <div className={styles.result_inner}>
                                    <div className={styles.result_inner_item}>
                                        <h3>Без НДС, руб</h3>
                                        <p>{totalConsumption.toLocaleString()}</p>
                                        <p>{network.toLocaleString()}</p>
                                        <p>{total.toLocaleString()}</p>
                                    </div>
                                    <div className={styles.result_inner_item}>
                                        <h3>С НДС, руб</h3>
                                        <p>{totalConsumptionNDC.toLocaleString()}</p>
                                        <p>{networkNDC.toLocaleString()}</p>
                                        <p>{totalNDC.toLocaleString()}</p>
                                    </div>
                                </div>
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

                    <div className={styles.input_group}>
                        <h3>Подключение</h3>
                        <div className={styles.input_wrapper}>
                            <label htmlFor="consumption">Предполагаемый расход (кубометров в сутки):</label>
                            <input type="number" id="consumption" value={consumptionWater} onChange={e => setConsumptionWater(+e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.input_group}>
                        <h3>Прокладка сети</h3>
                        <div className={styles.input_wrapper}>
                            <label htmlFor="length">Предполагаемая длина сети (метров):</label>
                            <input type="number" id="length" value={length} onChange={e => setLength(+e.target.value)} />
                        </div>
                        <div className={styles.input_wrapper}>
                            <label htmlFor="diameter">Предполагаемый диаметр cети (мм.):</label>
                            <select name="" id="diameter" value={diameter} onChange={e => setDiameter(+e.target.value)}>
                                <option value="0">- Выбирите диаметр -</option>
                                <option value="1">До 160 мм.</option>
                            </select>
                        </div>

                        <div className={styles.input_wrapper}>
                            <input type="checkbox" id="asphalt" value="20000" name="asphalt" checked={asphalt} onChange={e => setAsphalt(e.target.checked)} />
                            <label htmlFor="asphalt">Учитывать работы по восстановлению асфальтового покрытия</label>
                        </div>
                    </div>

                    <div className={styles.result}>
                        <table>
                            <thead>
                                <tr>
                                    <th rowSpan={2} style={{ width: '25%' }}>Расчеты</th>
                                    <th colSpan={2}>Расчетная стоимость</th>
                                </tr>
                                <tr>
                                    <th>Без НДС, руб.</th>
                                    <th>С НДС, руб.</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Подключение:</td>
                                    <td>{totalConsumptionWater.toLocaleString()}</td>
                                    <td>{totalConsumptionWaterNDC.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Сеть:</td>
                                    <td>{networkWater.toLocaleString()}</td>
                                    <td>{networkWaterNDC.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Итого:</td>
                                    <td>{totalWater.toLocaleString()}</td>
                                    <td>{totalWaterNDC.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}