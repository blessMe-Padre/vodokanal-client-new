import fs from 'fs';
import path from 'path';

import { Document, Paragraph, TextRun, AlignmentType, Packer } from "docx";

// Вспомогательная функция для создания разделов документа
function createSection(title: string, content: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: title,
                bold: true,
                size: 24,
            }),
            new TextRun({
                text: `\t${content}`,
                size: 24,
            }),
        ],
    });
}

export default async function makeDocx(body: Record<string, string>) {

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Шапка документа
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                        new TextRun({
                            text: `Директору МУП «Находка-Водоканал»`,
                            bold: true,
                            size: 24,
                        })
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                        new TextRun({
                            text: `Е.В. Лембет`,
                            bold: true,
                            size: 24,
                        }),
                    ],
                }),

                // Пустая строка
                new Paragraph({ children: [new TextRun("")] }),

                // От кого
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                        new TextRun({
                            text: "От:",
                            size: 24,
                        }),
                        new TextRun({
                            text: `\t${body.client_name}`,
                            size: 24,
                        }),
                    ],
                }),

                // Телефон
                new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                        new TextRun({
                            text: "Тел.:",
                            size: 24,
                        }),
                        new TextRun({
                            text: `\t${body.client_phone}`,
                            size: 24,
                        }),
                    ],
                }),

                // Пустая строка
                new Paragraph({ children: [new TextRun("")] }),

                // Заголовок "ЗАПРОС"
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "ЗАПРОС",
                            bold: true,
                            size: 28,
                            allCaps: true,
                        }),
                    ],
                }),

                // Текст под заголовком
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "о выдаче технических условий на подключение",
                            size: 24,
                        }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "(технологическое присоединение) к централизованным системам",
                            size: 24,
                        }),
                    ],
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "холодного водоснабжения и (или) водоотведения",
                            size: 24,
                        }),
                    ],
                }),

                // Пустая строка
                new Paragraph({ children: [new TextRun("")] }),
                // Пустая строка
                new Paragraph({ children: [new TextRun("")] }),

                // Раздел 1
                createSection("1. Сведения о лице, обратившемся с запросом:", `${body.full_name}`),

                // Раздел 2
                createSection("2. Контактные данные лица, обратившегося за выдачей технических условий:",
                    `${body.address}`),

                // Раздел 3
                createSection("3. Требуется подключение к централизованной системе:",
                    `${body.client_request}`),

                // Раздел 4
                createSection("4. Адрес и кадастровый номер подключаемого объекта:",
                    `${body.object_address}`),

                // Раздел 5
                createSection("5. Наименование объекта:", `${body.object_name}`),


                // Раздел 6
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "6. Планируемая величина максимальной необходимой мощности (нагрузки) составляет для потребления холодной",
                            size: 24,
                            bold: true,
                        }),
                        new TextRun({
                            text: `\t${body.power} м³/сутки`,
                            size: 24,
                        }),
                    ],
                }),

                // Раздел 7
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "6.1 в том числе на нужды пожаротушенияй",
                            size: 24,
                            bold: true,
                        }),
                        new TextRun({
                            text: `\t${body.firefighting} м³/сутки`,
                            size: 24,
                        }),
                    ],
                }),

                // Раздел 8
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "6.2 водоотведения",
                            size: 24,
                            bold: true,
                        }),
                        new TextRun({
                            text: `\t${body.water_drainage} м³/сутки`,
                            size: 24,
                        }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "7. Информация о предельных параметрах разрешенного строительства (реконструкции) подключаемого объекта",
                            size: 24,
                            bold: true,
                        }),
                        new TextRun({
                            text: `\t${body.information}`,
                            size: 24,
                        }),
                    ],
                }),


                // Дата и подпись
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: `Дата: ${body.date}\tПодпись: __________`,
                            size: 24,
                        }),
                    ],
                }),
            ],
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `Заявление ${body.full_name} - ${body.date}.docx`.replace(/[/\\?%*:|"<>]/g, '-');
    const publicDir = path.join(process.cwd(), 'public', 'documents');

    // Создаем папку, если ее нет
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, filename);
    fs.writeFileSync(filePath, buffer);

    // Возвращаем путь относительно public
    return `/tmp/${filename}`;
}