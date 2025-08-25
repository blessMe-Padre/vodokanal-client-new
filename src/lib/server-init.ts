import { setupCronJobs } from './cron';

// Инициализация серверных компонентов
export function initializeServer() {
    // Проверяем, что мы на сервере
    if (typeof window === 'undefined') {
        try {
            setupCronJobs();
        } catch (error) {
            console.error('Ошибка инициализации cron задач:', error);
        }
    }
}

// Автоматический вызов при импорте модуля
initializeServer();
