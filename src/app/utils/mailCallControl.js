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
            to: `${process.env.SMTP_FROM}, ${process.env.SMTP_SEND_COPY_TO}`,
            subject: "Вызов контролёра",
            text: `Имя: ${body.contact_fio}\nТелефон: ${body.contact_phone_number}`,
            html: `
            <b>Индивидуальные приборы учета воды<br><br>
            <b>Причина вызова контролёра:</b> ${body.call_reason}<br>
            <b>ФИО:</b> ${body.call_fio}<br>
            <b>Адрес :</b> ${body.call_address}<br>
            <b>Код двери:</b> ${body.call_code_door}<br>
            <b>Номер телефона:</b> ${body.call_phone_number}<br>
            <b>E-mail:</b> ${body.call_email}<br><br>
            ${body.date_call ? `<b>Предполагаемая дата и время ввода в эксплуатацию узла учета:</b> ${body.date_call}<br>` : ''}
            ${body.ipu_place ? `<b>Место установки ИПУ:</b> ${body.ipu_place}<br>` : ''}
            ${body.ipu_type ? `<b>Тип ИПУ:</b> ${body.ipu_type}<br>` : ''}
            ${body.call_after_demount ? `<b>После повторной установки припломбированной пломбы демонтаж в связи с:</b> ${body.call_after_demount}<br>` : ''}
            ${body.ipu_number ? `<b>Заводской № ИПУ*:</b> ${body.ipu_number}<br>` : ''}
            ${body.date_check_ipu ? `<b>Дата поверки ИПУ**:</b> ${body.date_check_ipu}<br>` : ''}
            ${body.ipu_readings ? `<b>Показания ИПУ*:</b> ${body.ipu_readings}<br>` : ''}
            ${body.call_attachments ? `<b>К письму прилагаю:</b> ${body.call_attachments}<br><br>` : ''}

            ${body.date ? `<b>Дата:</b> ${body.date}` : ''}
            `,
            attachments: attachments
        });

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Перебрасываем ошибку, чтобы её можно было поймать в API роуте
    }
}

export default sendEmail;