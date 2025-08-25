import fs from 'fs';

import { NextRequest, NextResponse } from 'next/server';

import sendEmail from '@/app/utils/mailSendExl';

export async function POST(request: NextRequest) {
  try {
    // получаем файл из /tmp/
    const file = fs.readFileSync('/tmp/Readings_2025_08.xlsx');
    const body = {
      date: '2025-08-25'
    }
    // const [excelBuffer, fileName] = makeExcel(body);

    // Отправляем файл на почту в момент отправки формы
    const result = await sendEmail(body, [file]);

    // Возвращаем файл клиенту
    return new NextResponse(file, {
      headers: {
        'Content-Disposition': `attachment; filename="Readings_2025_08.xlsx"`,
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