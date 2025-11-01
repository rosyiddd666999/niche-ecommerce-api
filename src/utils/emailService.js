const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_APP_EMAIL,
      pass: process.env.MAILER_APP_PASSWORD,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `${process.env.APP_NAME || "Shoe Store"} <${process.env.MAILER_APP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

const sendPasswordResetOTP = async (user, otp) => {
  const message = `
    Halo ${user.name},
    
    Anda menerima email ini karena telah meminta reset password untuk akun Anda.
    
    Kode OTP Anda adalah: ${otp}
    
    Kode ini berlaku selama 10 menit.
    
    Jika Anda tidak meminta reset password, abaikan email ini.
    
    Terima kasih,
    Tim Shoe Store
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reset Password</h2>
      <p>Halo <strong>${user.name}</strong>,</p>
      <p>Anda menerima email ini karena telah meminta reset password untuk akun Anda.</p>
      
      <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; text-align: center; border-radius: 5px;">
        <h1 style="color: #333; margin: 0; letter-spacing: 5px;">${otp}</h1>
      </div>
      
      <p>Kode OTP ini berlaku selama <strong>10 menit</strong>.</p>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">Terima kasih,<br>Tim Shoe Store</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: "Kode OTP Reset Password (berlaku 10 menit)",
    message,
    html,
  });
};

module.exports = { sendEmail, sendPasswordResetOTP };