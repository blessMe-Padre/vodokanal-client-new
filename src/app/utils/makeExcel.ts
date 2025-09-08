import fs from 'fs';
import path from 'path';

import * as XLSX from 'xlsx';

import { logger } from './logger';

interface ReadingsData {
  date: string;
  code_street: number;
  house_number: number;
  apartment_number: number;
  fio: string;
  address: string;
  readings_1_i?: number;
  readings_2_i?: number;
  readings_3_i?: number;
  readings_4_i?: number;
  readings_5_i?: number;
  readings_6_i?: number;
  readings_6_double?: number;
  readings_7_g?: number;
  readings_8_g?: number;
  readings_9_g?: number;
  readings_10_g?: number;
  readings_11_g?: number;
  readings_12_g?: number;
  readings_14_g?: number;
}

// Правильное определение типа для ошибки
interface ErrorDetail {
  message: string;
  stack?: string;
  path?: string;
  [key: string]: unknown;
}

export const makeExcel = (body: ReadingsData): [string, string] => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentYear = now.getFullYear();

    const fileName = `Readings_${currentDay.toString().padStart(2, '0')}_${currentMonth.toString().padStart(2, '0')}_${currentYear}.xlsx`;
    const tempDir = path.join(process.cwd(), 'tmp');
    const filePath = path.join(tempDir, fileName);

    logger.info(`Начало обработки файла для ${currentMonth}.${currentYear}: ${fileName}`);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      logger.info(`Создана временная директория: ${tempDir}`);
    }

    let workbook: XLSX.WorkBook;
    let worksheet: XLSX.WorkSheet;
    let excelData: Array<Record<string, string | number>> = [];

    if (fs.existsSync(filePath)) {
      logger.info(`Файл ${fileName} существует, загружаем для обновления`);
      try {
        const fileBuffer = fs.readFileSync(filePath);
        workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
        excelData = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet);
        logger.info(`Файл успешно загружен, записей: ${excelData.length}`);
      } catch (error) {
        const errorDetail: ErrorDetail = {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        };
        logger.error(`Ошибка при чтении файла ${filePath}`, errorDetail);
        throw error;
      }
    } else {
      logger.info(`Файл ${fileName} не существует, создаем новый`);
      workbook = XLSX.utils.book_new();
    }

    const newRecord = {
      'Дата подачи': body.date,
      'л/с №': `${body.code_street}-${body.house_number}-${body.apartment_number}`,
      'ФИО': body.fio,
      'Адрес': body.address,
      '(1)ХВС с/у': body.readings_1_i ?? 0.000,
      '(2)ГВС с/у': body.readings_2_i ?? 0.000,
      '(3)ХВС кух': body.readings_3_i ?? 0.000,
      '(4)ГВС кух': body.readings_4_i ?? 0.000,
      '(5)ХВС с/у': body.readings_5_i ?? 0.000,
      '(6)ГВС с/у': body.readings_6_i ?? 0.000,
      'Вд №': 0,
      '(6)ХВС (скваж)': body.readings_6_double ?? 0.000,
      '(7)ХВС с/у(гр)': body.readings_7_g ?? 0.000,
      '(8)ХВС кух(гр)': body.readings_8_g ?? 0.000,
      '(9)ГВС с/у(гр)': body.readings_9_g ?? 0.000,
      '(10)ГВС кух(гр)': body.readings_10_g ?? 0.000,
      '(11)ХВС туалет(гр)': body.readings_11_g ?? 0.000,
      '(12)ХВС ванна, титан(гр)': body.readings_12_g ?? 0.000,
      '(14)ГВС туалет(гр)': body.readings_14_g ?? 0.000,
    };

    excelData.push(newRecord);

    logger.info(
      `Добавлена новая запись: ${JSON.stringify({
        date: newRecord['Дата подачи'],
        account: newRecord['л/с №'],
        address: newRecord['Адрес']
      })}`
    );

    worksheet = XLSX.utils.json_to_sheet(excelData);
    const numFormat = '0.000';

    if (worksheet['!ref']) {
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = 4; C <= 18; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (worksheet[cellAddress] && typeof worksheet[cellAddress].v === 'number') {
            worksheet[cellAddress].z = numFormat;
          }
        }
      }
    }

    worksheet['!cols'] = [
      { wch: 12 }, { wch: 20 }, { wch: 40 }, { wch: 40 },
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
      { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 30 }, { wch: 15 }
    ];

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      XLSX.utils.book_append_sheet(workbook, worksheet, "Показания");
      logger.info(`Создан новый лист "Показания" в книге`);
    } else {
      workbook.Sheets[workbook.SheetNames[0]] = worksheet;
    }

    try {
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      fs.writeFileSync(filePath, excelBuffer);

      logger.info(`Файл успешно сохранен`, {
        path: filePath,
        size: `${(excelBuffer.length / 1024).toFixed(2)} KB`
      });

      return [filePath, fileName];
    } catch (error) {
      const errorDetail: ErrorDetail = {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      };

      logger.error(`Ошибка при сохранении файла`, {
        ...errorDetail,
        path: filePath
      } as ErrorDetail);

      throw error;
    }
  } catch (error) {
    const errorDetail: ErrorDetail = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
    logger.error(`Критическая ошибка в функции makeExcel`, errorDetail);
    throw error;
  }
};