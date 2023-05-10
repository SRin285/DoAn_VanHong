import nodeMailer from "nodemailer";
require('dotenv').config();

// khởi tạo một đối tượng email bằng NodeMailer
let transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // use SSL-TLS
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// gửi email thông thường bằng SMTP
let sendEmailNormal = (to, subject, htmlContent) => {
    let options = {
        from: process.env.MAIL_USERNAME,
        to: to,
        subject: subject,
        html: htmlContent
    };
    return transporter.sendMail(options);
};

// gửi email đính kèm tệp tin đến địa chỉ email được chỉ định.
let sendEmailWithAttachment = (to, subject, htmlContent, filename, path) => {
    let options = {
        from: process.env.MAIL_USERNAME,
        to: to,
        subject: subject,
        html: htmlContent,
        attachments: [
            {
                filename: filename,
                path: path
            }
        ]
    };
    return transporter.sendMail(options);
};

module.exports = {
    sendEmailNormal,
    sendEmailWithAttachment
};
