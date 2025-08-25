import { NextRequest, NextResponse } from 'next/server';

import sendEmail from '@/app/utils/mailSendExl';
import { makeExcel } from '@/app/utils/makeExcel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [excelBuffer, fileName] = makeExcel(body);
    const file = {
      name: fileName,
      buffer: excelBuffer,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }

    // Отправляем файл на почту в момент отправки формы
    // const result = await sendEmail(body, [file]);

    // Возвращаем файл клиенту
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

  } catch (error) {
    console.error('Error details:', {
      message: error,
      stack: error
    });

    return NextResponse.json(
      {
        status: 'error',
        message: 'Не удалось сформировать файл',
        details: error
      },
      { status: 500 }
    );
  }
}