// utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true untuk port 465, false untuk port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // ← Ini harus App Password!
  },
});

const sendPasswordResetOTP = async (user, otp) => {
  const mailOptions = {
    from: `"Ecommerce App" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: "Reset Password - Kode OTP",
    html: `
      <h1>Reset Password</h1>
      <p>Hi ${user.name},</p>
      <p>Kode OTP Anda untuk reset password:</p>
      <h2 style="color: #4CAF50;">${otp}</h2>
      <p>Kode ini berlaku selama 10 menit.</p>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetOTP };