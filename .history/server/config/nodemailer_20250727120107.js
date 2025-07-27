import nodemailer from 'nodemailer';

const trasnporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    po
});

export default trasnporter;