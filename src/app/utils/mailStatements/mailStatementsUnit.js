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

async function sendEmailUnit(body, files = []) {
    try {
        files.forEach((file, index) => {
            console.log(`File ${index}:`, {
                name: file.name,
                type: file.type,
                bufferSize: file.buffer ? file.buffer.length : 'undefined'
            });
        });

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
            subject: "Заявление на узел учета",
            text: `Имя: ${body.client_name}\nТелефон: ${body.client_phone}`,
            html: `
            <b>Имя:</b> ${body.client_name}<br>
            <b>Номер телефона:</b> ${body.client_phone}<br>
            <b>Объект:</b> ${body.object}<br>
            <b>Объекта расположенного по адресу::</b> ${body.object_address}<br>
            <b>Планируемая величина необходимой подключаемой нагрузки::</b> ${body.power}
            <br><br>
            `,
            attachments: attachments
        });

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Перебрасываем ошибку, чтобы её можно было поймать в API роуте
    }
}

export default sendEmailUnit;