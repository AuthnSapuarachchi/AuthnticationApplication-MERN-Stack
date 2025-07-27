import nodemailer from 'nodemailer';

const trasnporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
});

export default trasnporter;