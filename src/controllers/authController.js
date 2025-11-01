const crypto = require("crypto");
const { User } = require("../models/index.js");
const { createSendTokenCookies } = require("../utils/createToken.js");
const { sendPasswordResetOTP } = require("../utils/emailService.js");

const signUp = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ 
      where: { email: req.body.email } 
    });

    if (existingUser) {
      return res.status(400).json({ 
        status: "error",
        message: "Email sudah terdaftar" 
      });
    }

    const confirmPasswordValidation = req.body.password === req.body.confirmPassword;

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: confirmPasswordValidation,
      role: req.body.role,
    });

    createSendTokenCookies(user, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: "error",
      message: error.message 
    });
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.scope("withPassword").findOne({ 
      where: { email: req.body.email } 
    });

    if (!user) {
      return res.status(401).json({ 
        status: "error",
        message: "Email atau password salah" 
      });
    }

    if (!user.active) {
      return res.status(401).json({ 
        status: "error",
        message: "Akun Anda tidak aktif. Silakan hubungi admin" 
      });
    }

    // Verify password
    const isPasswordValid = await user.correctPassword(req.body.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        status: "error",
        message: "Email atau password salah" 
      });
    }

    createSendTokenCookies(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: "error",
      message: error.message 
    });
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ 
      status: "success",
      message: "Logout berhasil" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: "error",
      message: error.message 
    });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ 
      where: { email: req.body.email } 
    });

    if (!user) {
      return res.status(404).json({ 
        status: "error",
        message: "Tidak ada user dengan email tersebut" 
      });
    }

    // Generate OTP token
    const otp = user.createPasswordResetToken();
    
    // Save token ke database
    await user.save({ validate: false });

    // Send OTP via email
    try {
      await sendPasswordResetOTP(user, otp);

      res.status(200).json({
        status: "success",
        message: "Kode OTP telah dikirim ke email Anda"
      });
    } catch (emailError) {
      // Jika gagal kirim email, hapus token dari database
      user.password_reset_token = null;
      user.password_reset_expires = null;
      await user.save({ validate: false });

      console.error("Email error:", emailError);
      return res.status(500).json({
        status: "error",
        message: "Gagal mengirim email. Silakan coba lagi"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: "error",
      message: error.message 
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Hash OTP dari user untuk dicocokkan dengan database
    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Find user dengan email, token yang match, dan belum expired
    const user = await User.scope("withPassword").findOne({
      where: {
        email: email,
        password_reset_token: hashedOTP,
      }
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Kode OTP salah atau sudah tidak valid"
      });
    }

    // Check jika OTP sudah expired
    if (user.password_reset_expires < new Date()) {
      return res.status(400).json({
        status: "error",
        message: "Kode OTP sudah kadaluarsa. Silakan minta kode baru"
      });
    }

    // Update password dan hapus reset token
    user.password = newPassword;
    user.password_reset_token = null;
    user.password_reset_expires = null;
    
    await user.save();

    // Login user setelah reset password
    createSendTokenCookies(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: "error",
      message: error.message 
    });
  }
};

module.exports = {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword
};