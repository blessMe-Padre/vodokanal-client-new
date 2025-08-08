import { NextRequest, NextResponse } from 'next/server';

import sendEmail from '@/app/utils/mailStatements';

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

    // получаем в result все что уполо в api
    const result = await sendEmail(formFields, fileBuffers);

    return NextResponse.json({
      status: 'success',
      message: 'Данные успешно отправлены',
      emailResult: {
        accepted: result.accepted,
        message: "Письмо успешно отправлено",
      },
      details: {
        formFields,
        filesCount: allFiles.length,
        filesInfo: allFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
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