import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

async function sendEmail(body, files = []) {
    try {
        // Проверяем, что файлы имеют правильную структуру
        const attachments = files.map(file => {
            if (!file.name || !file.buffer) {
                throw new Error(`Некорректная структура файла: ${JSON.stringify(file)}`);
            }

            return {
                filename: file.name,
                content: file.buffer,
                contentType: file.type || 'application/octet-stream'
            };
        });

        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: `${process.env.SMTP_FROM}, ${process.env.SMTP_SEND_COPY_TO}`,
            subject: `Передача показаний через сайт за ${body.date}`,
            html: `
            <b>Передача показаний через сайт за ${body.date}</b>
            <p>Файл с показаниями прикреплен к письму.</p>
            `,
            attachments: attachments
        };

        console.log('Отправка email с файлами:', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            attachmentsCount: attachments.length,
            attachmentNames: attachments.map(a => a.filename)
        });

        const info = await transporter.sendMail(mailOptions);

        console.log("Email успешно отправлен:", info.messageId);
        return info;
    } catch (error) {
        console.error("Ошибка отправки email:", error);
        throw error; // Перебрасываем ошибку, чтобы её можно было поймать в API роуте
    }
}

export default sendEmail;