import fs from 'fs';
import path from 'path';

import * as XLSX from 'xlsx';


export const makeExcel = (body: any) => {
    
    // путь до файа
    const tempDir = path.join(process.cwd(), 'tmp');
    const fileName = `Readings.xlsx`;
    const filePath = path.join(tempDir, fileName);

    // создаем папку если ее нет
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    let workbook: XLSX.WorkBook;
    let worksheet: XLSX.WorkSheet;
    let excelData: any[] = [];

    // Проверяем, существует ли уже файл
    if(fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      excelData = XLSX.utils.sheet_to_json(worksheet);
    } else {
      workbook = XLSX.utils.book_new();
    }

    // Создаем новую запись из body
    const newRecord = {
      'Дата подачи': body.date,
      'л/с №': `${body.code_street}-${body.house_number}-${body.apartment_number}`,
      'ФИО': body.fio,
      'Адрес': body.address,
      '(1)ХВС с/у': body.readings_1_i || 0.000,
      '(2)ГВС с/у': body.readings_2_i || 0.000,
      '(3)ХВС кух': body.readings_3_i || 0.000,
      '(4)ГВС кух': body.readings_4_i || 0.000,
      '(5)ХВС с/у': body.readings_5_i || 0.000,
      '(6)ГВС с/у': body.readings_6_i || 0.000,
      'Вд №': 0,
      '(6)ХВС (скваж)': body.readings_6_double || 0.000,	
      '(7)ХВС с/у(гр)': body.readings_7_g || 0.000,
      '(8)ХВС кух(гр)': body.readings_8_g || 0.000,
      '(9)ГВС с/у(гр)': body.readings_9_g || 0.000,
      '(10)ГВС кух(гр)': body.readings_10_g || 0.000,
      '(11)ХВС туалет(гр)': body.readings_11_g || 0.000,
      '(12)ХВС ванна, титан(гр)': body.readings_12_g || 0.000,
      '(14)ГВС туалет(гр)': body.readings_14_g || 0.000,
    };

    excelData.push(newRecord);
    worksheet = XLSX.utils.json_to_sheet(excelData);


    worksheet['!cols'] = [
      { wch: 12 },  // 'Дата подачи' - ширина 12 символов
      { wch: 20 },  // 'л/с №' - ширина 20 символов (двойная ширина)
      { wch: 40 },  // 'ФИО'
      { wch: 40 },  // 'Адрес'
      { wch: 10 },  // '(1)ХВС с/у'
      { wch: 10 },  // '(2)ГВС с/у'
      { wch: 10 },  // '(3)ХВС кух'
      { wch: 10 },  // '(4)ГВС кух'
      { wch: 10 },  // '(5)ХВС с/у'
      { wch: 10 },  // '(6)ГВС с/у'
      { wch: 8 },   // 'Вд №'
      { wch: 15 },  // '(6)ХВС (скваж)'
      { wch: 15 },  // '(7)ХВС с/у(гр)'
      { wch: 15 },  // '(8)ХВС кух(гр)'
      { wch: 15 },  // '(9)ГВС с/у(гр)'
      { wch: 15 },  // '(10)ГВС кух(гр)'
      { wch: 15 },  // '(11)ХВС туалет(гр)'
      { wch: 30 },  // '(12)ХВС ванна, титан(гр)'
      { wch: 15 }   // '(14)ГВС туалет(гр)'
  ];

    // Если это новый файл, добавляем worksheet в workbook
    if(!workbook.SheetNames || workbook.SheetNames.length === 0) {
      XLSX.utils.book_append_sheet(workbook, worksheet, "Показания");
    } else {
      workbook.Sheets[workbook.SheetNames[0]] = worksheet;
    }

   // Записываем файл
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    fs.writeFileSync(filePath, excelBuffer);

    return [filePath, fileName];
}