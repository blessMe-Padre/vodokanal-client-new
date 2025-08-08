import { NextRequest, NextResponse } from 'next/server';

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

    // Получаем все файлы
    const allFiles = formData.getAll('files') as File[];

    console.log('Полученные данные формы:', formFields);
    console.log('Полученные файлы:', allFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    })));

    // Здесь можно добавить логику отправки на почту
    // Например, использовать nodemailer или другой сервис

    return NextResponse.json({
      status: 'success',
      message: 'Данные успешно отправлены',
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