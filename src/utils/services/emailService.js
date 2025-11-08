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
  try{
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
  console.log(`Password reset OTP email sent to ${user.email}`);
  return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const sendPaymentSuccessEmail = async (user, order, items) => {
  try {
    // Format items untuk email
    const itemsList = items
      .map((item) => {
        const productName = item.product?.title || "Product";
        return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${productName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
            item.quantity
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">Rp ${item.price.toLocaleString(
            "id-ID"
          )}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">Rp ${(
            item.price * item.quantity
          ).toLocaleString("id-ID")}</td>
        </tr>
      `;
      })
      .join("");

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background-color: #4CAF50; color: white; padding: 10px; text-align: left; }
          .total { font-weight: bold; font-size: 18px; color: #4CAF50; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Pembayaran Berhasil</h1>
          </div>
          <div class="content">
            <p>Halo <strong>${user.name}</strong>,</p>
            <p>Terima kasih! Pembayaran Anda telah berhasil diproses.</p>
            
            <div class="order-details">
              <h3>Detail Pesanan</h3>
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Transaction ID:</strong> ${
                order.payment_transaction_id
              }</p>
              <p><strong>Tanggal:</strong> ${new Date(
                order.paid_at
              ).toLocaleString("id-ID")}</p>
              
              <h4>Alamat Pengiriman:</h4>
              <p>
                ${order.shipping_address.details}<br>
                ${order.shipping_address.city}, ${
      order.shipping_address.postalCode
    }<br>
                Telp: ${order.shipping_address.phone}
              </p>

              <h4>Produk yang Dibeli:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Qty</th>
                    <th>Harga</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>

              <table style="margin-top: 20px;">
                <tr>
                  <td style="text-align: right; padding: 5px;"><strong>Subtotal:</strong></td>
                  <td style="text-align: right; padding: 5px;">Rp ${(
                    order.total_order_price -
                    order.tax_price -
                    order.shipping_price
                  ).toLocaleString("id-ID")}</td>
                </tr>
                <tr>
                  <td style="text-align: right; padding: 5px;"><strong>Pajak (2%):</strong></td>
                  <td style="text-align: right; padding: 5px;">Rp ${order.tax_price.toLocaleString(
                    "id-ID"
                  )}</td>
                </tr>
                <tr>
                  <td style="text-align: right; padding: 5px;"><strong>Ongkir:</strong></td>
                  <td style="text-align: right; padding: 5px;">Rp ${order.shipping_price.toLocaleString(
                    "id-ID"
                  )}</td>
                </tr>
                <tr>
                  <td style="text-align: right; padding: 10px; border-top: 2px solid #4CAF50;"><strong>TOTAL:</strong></td>
                  <td style="text-align: right; padding: 10px; border-top: 2px solid #4CAF50;" class="total">Rp ${order.total_order_price.toLocaleString(
                    "id-ID"
                  )}</td>
                </tr>
              </table>
            </div>

            <p>Pesanan Anda sedang diproses dan akan segera dikirim.</p>
            <p>Anda dapat melacak status pesanan di dashboard Anda.</p>
          </div>
          <div class="footer">
            <p>Email ini dikirim otomatis, mohon tidak membalas.</p>
            <p>&copy; ${new Date().getFullYear()} Toko Online. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `✓ Pembayaran Berhasil - Order #${order.id}`,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Payment success email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = { sendPasswordResetOTP, sendPaymentSuccessEmail };
