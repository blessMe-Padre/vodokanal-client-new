import fs from 'fs';
import path from 'path';

import * as docx from "docx";
import { Document, Packer, Paragraph, TextRun } from "docx";


export default async function makeDocx(body: Record<string, string>) {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun("Hello World"),
                            new TextRun({
                                text: "Foo Bar",
                                bold: true,
                            }),
                            new TextRun({
                                text: "\tGithub is the best",
                                bold: true,
                            }),
                        ],
                    }),
                ],
            },
        ],
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