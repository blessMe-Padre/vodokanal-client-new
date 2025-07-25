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
      'телефон': body.phone_number,
      'ФИО': body.fio,
      'Адрес': body.address,
      '(1)ХВС с/у': body.readings_1_i,
      '(2)ГВС с/у': body.readings_2_i,
      '(3)ХВС кух': body.readings_3_i,
      '(4)ГВС кух': body.readings_4_i,
      '(5)ХВС с/у': body.readings_5_i,
      '(6)ГВС с/у': body.readings_6_i,
      'Вд №': 0,
      '(6)ХВС (скваж)': body.readings_6_double,	
      '(7)ХВС с/у(гр)': body.readings_7_g,
      '(8)ХВС кух(гр)': body.readings_8_g,
      '(9)ГВС с/у(гр)': body.readings_9_g,
      '(10)ГВС кух(гр)': body.readings_10_g,
      '(11)ХВС туалет(гр)': body.readings_11_g,
      '(12)ХВС ванна, титан(гр)': body.readings_12_g,
      '(14)ГВС туалет(гр)': body.readings_14_g,
    };

    excelData.push(newRecord);
    worksheet = XLSX.utils.json_to_sheet(excelData);

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