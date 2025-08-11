import fs from 'fs';
import path from 'path';

import * as docx from "docx";
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

export default async function makeDocxBorder(body: Record<string, string>) {

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
                            text: "Прошу выдать технические условия на проектирование узла учета потребляемой объекта",
                            size: 24,
                        }),
                    ],
                }),

                // Пустая строка
                new Paragraph({ children: [new TextRun("")] }),
                // Пустая строка
                new Paragraph({ children: [new TextRun("")] }),

                // Раздел 1
                createSection("Прошу выдать акт разграничении эксплуатационной и балансовой ответственности сторон по водопроводным и канализационным сетям на них между МУП «Находка - Водоканал» и абонентом Объекта расположенного по адресу:", `${body.address}`),

                // Раздел 2
                createSection("Объекта расположенного по адресу:",
                    `${body.object_address}`),
               
                // Раздел 6
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "1 Исполнительная съемка на проложенную сеть (масштаб 1:500)",
                            size: 24,
                            bold: true,
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
    return `/documents/${filename}`;
}