import nodemailer from 'nodemailer';

const trasnporter = nodemailer.createTransport({
    host
});

export default trasnporter;