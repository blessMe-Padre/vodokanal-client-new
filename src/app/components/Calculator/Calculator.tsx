'use client';
import { useState } from 'react';
import styles from './style.module.scss';
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

type TabIndex = 0 | 1;

type TabButton = { title: string };

export default function Calculator() {
    const [activeTab, setActiveTab] = useState<TabIndex>(0);
    const [consumption, setConsumption] = useState(0);
    const [length, setLength] = useState(0);
    const [diameter, setDiameter] = useState(0);
    const [asphalt, setAsphalt] = useState(false);

    // Примерные тарифы (можно заменить на реальные)
    const bazovayStoimost: number = 1600; // Предполагаемый расход (кубометров в сутки): на 1 кубометр в сутки
    const diametrSety: number[] = [
        5500, // До 100 мм.
        6000, // От 100 до 125 мм.
        6500, // От 125 до 150 мм.
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

    const totalConsumption: number = consumption * bazovayStoimost;
    const totalConsumptionNDC: number = Math.round(totalConsumption * (1 + NDC));
    const network: number = calcNetwork();
    const networkNDC: number = Math.round(network * (1 + NDC));
    const total: number = totalConsumption + network;
    const totalNDC: number = Math.round(total * (1 + NDC));

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
            <div className={styles.tabs_header}>
                {tabsButton.map((item, index) => (
                    <button
                        key={index}
                        className={styles.tabButton}
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
                <h2>Расчет подключения водоснабжения</h2>

                <div className={styles.input_group}>
                    <h3>Подключение</h3>
                    <div className={styles.input_wrapper}>
                        <label htmlFor="consumption">Предполагаемый расход (кубометров в сутки):</label>
                        <input type="number" id="consumption" value={consumption} onChange={e => setConsumption(+e.target.value)} />
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
                            <option value="1">До 100 мм.</option>
                            <option value="2">От 100 до 125 мм.</option>
                            <option value="3">От 125 до 150 мм.</option>
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
                                <td>{totalConsumption.toLocaleString()}</td>
                                <td>{totalConsumptionNDC.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>Сеть:</td>
                                <td>{network.toLocaleString()}</td>
                                <td>{networkNDC.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>Итого:</td>
                                <td>{total.toLocaleString()}</td>
                                <td>{totalNDC.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <motion.div
                layout
                variants={variants}
                initial="hidden"
                animate={activeTab === 1 ? "visible" : "hidden"}
            >
                <div className={styles.tabContent}>
                    <h2>Расчет водоотведение</h2>

                    <div className={styles.input_group}>
                        <h3>Подключение</h3>
                        <div className={styles.input_wrapper}>
                            <label htmlFor="consumption">Предполагаемый расход (кубометров в сутки):</label>
                            <input type="number" id="consumption" value={consumption} onChange={e => setConsumption(+e.target.value)} />
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
                                <option value="2">До 160 мм.</option>
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
                                    <td>{totalConsumption.toLocaleString()}</td>
                                    <td>{totalConsumptionNDC.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Сеть:</td>
                                    <td>{network.toLocaleString()}</td>
                                    <td>{networkNDC.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Итого:</td>
                                    <td>{total.toLocaleString()}</td>
                                    <td>{totalNDC.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}