import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'brevo', // Use the service name
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default transporter;