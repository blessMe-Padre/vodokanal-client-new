import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

// import sendEmail from '@/app/utils/mailStatements/mailStatements';
// import sendEmailLegal from '@/app/utils/mailStatements/mailStatementsLegal';
// import sendEmailLegalPod from '@/app/utils/mailStatements/mailStatementsLegalPod';
// import sendEmailPod from '@/app/utils/mailStatements/mailStatementsPod';
import makeDocx from '@/app/utils/makeDocx/makeDocx';
import makeDocxBorder from '@/app/utils/makeDocx/makeDocxBorder';
import makeDocxLegal from '@/app/utils/makeDocx/makeDocxLegal';
import makeDocxLegalPod from '@/app/utils/makeDocx/makeDocxLegalPod';
import makeDocxPod from '@/app/utils/makeDocx/makeDocxPod';
import makeDocxUnit from '@/app/utils/makeDocx/makeDocxUnit';

// Типы для форм
type FormType = 'zapros_individuals' | 'zapros_legal' | 'zapros_individuals_pod' | 'zapros_legal_pod' | 'zapros_border' | 'zapros_unit';

// Интерфейс для данных формы
interface FormFields {
  form_name: FormType;
  [key: string]: string;
}

// Интерфейс для файла
interface FileAttachment {
  name: string;
  type: string;
  buffer: Buffer;
}

// Интерфейс для результата email
interface EmailResult {
  accepted: string[];
  message: string;
}

// Интерфейс для ответа API
interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await request.formData();

    // Получаем все поля формы
    const formFields: FormFields = {} as FormFields;
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
    const fileBuffers: FileAttachment[] = await Promise.all(
      allFiles.map(async (file): Promise<FileAttachment> => {
        const buffer = await file.arrayBuffer();
        return {
          name: file.name,
          type: file.type,
          buffer: Buffer.from(buffer)
        };
      })
    );

    // Отправляем всю форм дату в функцию которая сформирует docx файл
    let docxPath: string = '';

    // Используем switch case для обработки различных типов форм
    switch (formFields.form_name) {
      case 'zapros_individuals':
        docxPath = await makeDocx(formFields);
        break;
      
      case 'zapros_legal':
        docxPath = await makeDocxLegal(formFields);
        break;
      
      case 'zapros_individuals_pod':
        docxPath = await makeDocxPod(formFields);
        break;
      
      case 'zapros_legal_pod':
        docxPath = await makeDocxLegalPod(formFields);
        break;
      
      case 'zapros_border':
        docxPath = await makeDocxBorder(formFields);
        break;
      
      case 'zapros_unit':
        docxPath = await makeDocxUnit(formFields);
        break;
      
      default:
        throw new Error(`Неизвестный тип формы: ${formFields.form_name}`);
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
    const docxAttachment: FileAttachment = {
      name: path.basename(docxPath),
      buffer: docxBuffer,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    // Объединяем все вложения (пользовательские файлы + docx)
    const allAttachments: FileAttachment[] = [...fileBuffers, docxAttachment];

    // Отправляем письмо со всеми вложениями в зависимости от типа формы
    const emailResult: EmailResult | null = null;

    switch (formFields.form_name) {
      case 'zapros_individuals':
        // emailResult = await sendEmail(formFields, allAttachments);
        break;
      
      case 'zapros_legal':
        // emailResult = await sendEmailLegal(formFields, allAttachments);
        break;
      
      case 'zapros_individuals_pod':
        // emailResult = await sendEmailPod(formFields, allAttachments);
        break;
      
      case 'zapros_legal_pod':
        // emailResult = await sendEmailLegalPod(formFields, allAttachments);
        break;
    }

    return NextResponse.json({
      status: 'success',
      message: 'Данные успешно отправлены',
      emailResult: null,
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
        details: { error: String(error) }
      },
      { status: 500 }
    );
  }
}