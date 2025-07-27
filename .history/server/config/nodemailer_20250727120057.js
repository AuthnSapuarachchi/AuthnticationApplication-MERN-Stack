import nodemailer from 'nodemailer';

const trasnporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
});

export default trasnporter;