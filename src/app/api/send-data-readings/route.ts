import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Добавлен await для чтения JSON
        const body = await request.json();
        console.log('Received data:', body);
        
        // Здесь можно добавить обработку данных и сохранение в БД
        
        return NextResponse.json({ 
            status: 'success', 
            message: 'Данные успешно отправлены!' 
        });
        
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { status: 'error', message: 'Ошибка сервера' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Hello, world!' });
}