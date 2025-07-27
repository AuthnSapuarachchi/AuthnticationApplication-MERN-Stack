import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: ser
        pass: process.env.SMTP_PASSWORD
    }
});

export default transporter;