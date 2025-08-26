import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

import { logger } from '@/app/utils/logger';
import sendEmail from '@/app/utils/mailSendExl';

export async function POST() {
  try {
    // Получаем файл из tmp директории
    const files = fs.readdirSync(path.join(process.cwd(), 'tmp'));
    const filePath = files.find(file => file.includes('Readings'));

    if (!filePath) {
      logger.warn('Файл показаний не найден');
      return NextResponse.json(
        { status: 'error', message: 'Файл показаний не найден' },
        { status: 404 }
      );
    }

    const fullPath = path.join(process.cwd(), 'tmp', filePath);

    if (!fs.existsSync(fullPath)) {
      logger.warn('Файл показаний не найден', { filePath });
      return NextResponse.json(
        { status: 'error', message: 'Файл показаний не найден' },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const body = {
      date: '2025-08-25'
    };

    logger.info('Отправка файла показаний по email', {
      filePath,
      fileSize: `${(fileBuffer.length / 1024).toFixed(2)} KB`
    });

    // Отправляем файл на почту
    const result = await sendEmail(body, [{
      name: 'Readings_2025_08.xlsx',
      buffer: fileBuffer,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }]);

    logger.info('Email с файлом показаний успешно отправлен', {
      messageId: result.messageId
    });

    // Возвращаем файл клиенту
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="Readings_2025_08.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

  } catch (error) {
    const err = error as Error;
    logger.error('Ошибка при отправке файла', {
      message: err.message,
      stack: err.stack
    });

    return NextResponse.json(
      {
        status: 'error',
        message: 'Не удалось отправить файл',
        details: err.message
      },
      { status: 500 }
    );
  }
}