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
        // Подготавливаем attachments для файлов
        const attachments = files.map(file => ({
            filename: file.name,
            content: file.buffer,
            contentType: file.type
        }));

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            // to: `${process.env.SMTP_FROM}, Dubrovinaaa@yandex.ru`,
            to: `${process.env.SMTP_FROM}, ${process.env.SMTP_SEND_COPY_TO}`,
            subject: `Передача показаний через сайт за ${body.date}`,
            html: `
            <b>Передача показаний через сайт за ${body.date}</b>`,
            attachments: attachments
        });

        // console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Перебрасываем ошибку, чтобы её можно было поймать в API роуте
    }
}

export default sendEmail;