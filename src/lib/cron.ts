import fs from 'fs';
import path from 'path';

import cron from 'node-cron';

import { createCronLogger } from '@/app/utils/logger';

export function setupCronJobs() {
    // Проверяем, что мы на сервере
    if (typeof window !== 'undefined') {
        return;
    }

    const cronLogger = createCronLogger();

    // Запуск каждый день в 13:53 по московскому времени
    cron.schedule('45 00 * * *', async () => {
        const now = new Date();
        cronLogger.info('Запуск ежедневной задачи отправки email', {
            serverTime: now.toISOString(),
            moscowTime: new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" })).toISOString()
        });

        try {
            // Проверяем существование файла
            // Читаем содержимое директории
            // Находим файл с именем, содержащим "Readings"
            const files = fs.readdirSync(path.join(process.cwd(), 'tmp'));
            const filePath = files.find(file => file.includes('Readings'));

            if (!filePath) {
                cronLogger.warn('Файл показаний не найден');
                return;
            }

            const fullPath = path.join(process.cwd(), 'tmp', filePath);

            if (!fs.existsSync(fullPath)) {
                cronLogger.warn('Файл показаний не найден', { fullPath });
                return;
            }

            // Проверяем переменные окружения
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const response = await fetch(`${baseUrl}/api/send-file`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                cronLogger.info('Ежедневный email успешно отправлен');

                // Удаляем файл после успешной отправки
                // try {
                //     fs.unlinkSync(filePath);
                //     cronLogger.info('Файл показаний удален после отправки', { fullPath });
                // } catch (deleteError) {
                //     const error = deleteError as Error;
                //     cronLogger.error('Ошибка при удалении файла', {
                //         message: error.message,
                //         stack: error.stack
                //     });
                // }

            } else {
                const errorText = await response.text();
                cronLogger.error('Ошибка отправки ежедневного email', {
                    message: `HTTP ${response.status}: ${errorText}`
                });
            }
        } catch (error) {
            const err = error as Error;
            cronLogger.error('Ошибка в cron задаче', {
                message: err.message,
                stack: err.stack
            });
        }
    }, {
        timezone: 'Europe/Moscow'
    });

    cronLogger.info('Cron задачи настроены');
}