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

    // Запуск каждый день в 07:45 по местному времени - (30 00)
    cron.schedule('40 00 * * *', async () => {
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

            // Получаем дату из имени файла
            // const date = filePath.split('_')[1] + '_' + filePath.split('_')[2];
            // получаем день месяца из new Date
            // const day = new Date().getDate();
            // Делаем копию файла в tmp/Readings_copy.xlsx
            // fs.copyFileSync(fullPath, path.join(process.cwd(), 'tmp/copy', `copy_${date}`));

            const date = filePath.replace('Readings_', '').replace('.xlsx', '');
            const day = new Date().getDate();
            fs.copyFileSync(fullPath, path.join(process.cwd(), 'tmp/copy', `copy_${date}_${day}.xlsx`));

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
                try {
                    fs.unlinkSync(fullPath);
                    cronLogger.info('Файл показаний удален после отправки', { fullPath });
                } catch (deleteError) {
                    const error = deleteError as Error;
                    cronLogger.error('Ошибка при удалении файла', {
                        message: error.message,
                        stack: error.stack
                    });
                }

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

    // Запуск каждый день в 07:10 по местному времени - (10 00) для очистки папки documents
    cron.schedule('35 00 * * *', async () => {
        try {
            const documentsPath = path.join(process.cwd(), 'public', 'documents');
            if (!fs.existsSync(documentsPath)) return;
            const files = fs.readdirSync(documentsPath);
            if (files.length === 0) return;

            // Удаляем все файлы в папке
            let deletedCount = 0;
            for (const file of files) {
                const filePath = path.join(documentsPath, file);
                try {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                } catch (deleteError) {
                    const error = deleteError as Error;
                    cronLogger.error('Ошибка при удалении файла', {
                        message: error.message
                    });
                }
            }

            cronLogger.info('Очистка папки documents выполнена', {
                deletedFiles: deletedCount,
                totalFiles: files.length
            });

        } catch (error) {
            const err = error as Error;
            cronLogger.error('Ошибка в cron задаче очистки documents', {
                message: err.message,
                stack: err.stack
            });
        }
    }, {
        timezone: 'Europe/Moscow'
    });
}