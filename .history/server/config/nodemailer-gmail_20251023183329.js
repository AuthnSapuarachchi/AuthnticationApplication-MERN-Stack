import nodemailer from "nodemailer";

// Gmail SMTP Configuration
// IMPORTANT: You need to generate an App Password from Google Account settings
// Go to: https://myaccount.google.com/apppasswords

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER, // Your Gmail address
    pass: process.env.SMTP_PASSWORD, // Your Gmail App Password (NOT your regular password)
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Gmail SMTP Connection Error:", error);
  } else {
    console.log("✅ Gmail SMTP Server is ready to send emails");
  }
});

export default transporter;
