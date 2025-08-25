import fs from 'fs';

import cron from 'node-cron';

export function setupCronJobs() {
    // Запуск каждый день в 13.26
    cron.schedule('35 13 * * *', async () => {
        console.log('Running daily email job...');

        try {
            const response = await fetch(`/api/send-file`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.CRON_SECRET}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Daily email sent successfully');

                // удаляем файл из /tmp/
                // fs.unlinkSync('/tmp/Readings_2025_08.xlsx');

                // логирование отправки файла в logs/cron.log
                fs.appendFileSync('logs/cron.log', `[${new Date().toISOString()}] Daily email sent successfully\n`);

            } else {
                console.error('Failed to send daily email');
            }
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    }, {
        timezone: 'Europe/Moscow' // укажите вашу временную зону
    });
}