import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);

    // Отправка на почту

    return NextResponse.json({
      status: 'success',
      message: 'Данные успешно отправлены',
      details: body
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