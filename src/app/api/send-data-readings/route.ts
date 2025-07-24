
import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const excelData = Object.entries(body).map(([key, value]) => ({
      'Поле': key,
      'Значение': value
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Показания");

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileName = `water_${Date.now()}.xlsx`;
    const filePath = path.join(tempDir, fileName);

    fs.writeFileSync(filePath, excelBuffer);

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