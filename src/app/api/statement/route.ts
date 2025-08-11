import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import sendEmail from '@/app/utils/mailStatements';
import makeDocx from '@/app/utils/makeDocx';
import makeDocxLegal from '@/app/utils/makeDocxLegal';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Получаем все поля формы
    const formFields: Record<string, string> = {};
    const files: File[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === 'files') {
        if (value instanceof File) {
          files.push(value);
        }
      } else {
        formFields[key] = value.toString();
      }
    }

    // Получаем все файлы для информации
    const allFiles = formData.getAll('files') as File[];

    // Конвертируем File объекты в буферы для отправки
    const fileBuffers = await Promise.all(
      allFiles.map(async (file) => {
        const buffer = await file.arrayBuffer();
        return {
          name: file.name,
          type: file.type,
          buffer: Buffer.from(buffer)
        };
      })
    );

    // отправляем всю форм дату в функцию которая сформирует docx файл
    let docxPath: string = '';

    if (formFields.form_name === 'zapros_individuals') {
      docxPath = await makeDocx(formFields);
    }
    if (formFields.form_name === 'zapros_legal') {
      docxPath = await makeDocxLegal(formFields);
    }

    // Проверяем, что docx файл был создан
    if (!docxPath) {
      throw new Error('Docx file was not created - invalid form type');
    }

    // Читаем созданный docx файл
    const fullPath = path.join(process.cwd(), 'public', docxPath);

    // Проверяем, существует ли файл
    if (!fs.existsSync(fullPath)) {
      throw new Error('Docx file was not created');
    }

    const docxBuffer = fs.readFileSync(fullPath);

    // Создаем объект для вложения docx файла
    const docxAttachment = {
      name: path.basename(docxPath),
      buffer: docxBuffer,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    // Объединяем все вложения (пользовательские файлы + docx)
    const allAttachments = [...fileBuffers, docxAttachment];

    // Отправляем письмо со всеми вложениями
    // const result = await sendEmail(formFields, allAttachments);

    return NextResponse.json({
      status: 'success',
      message: 'Данные успешно отправлены',
      // emailResult: {
      //   accepted: result.accepted,
      //   message: "Письмо успешно отправлено",
      // },
      details: {
        formFields,
        filesCount: allFiles.length,
        filesInfo: allFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        docxFile: docxPath
      }
    });

  } catch (error) {
    console.error('Error details:', {
      message: error,
      stack: error
    });

    return NextResponse.json(
      {
        status: 'error',
        message: 'Не удалось отправить данные',
        details: error
      },
      { status: 500 }
    );
  }
}