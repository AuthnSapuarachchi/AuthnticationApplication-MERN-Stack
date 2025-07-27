import nodemailer from 'nodemailer';

const trasnporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
});

export default trasnporter;