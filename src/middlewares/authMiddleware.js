const jwt = require("jsonwebtoken");
const { User } = require("../models/index.js");

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Anda belum login. Silakan login terlebih dahulu"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Cek apakah user masih exist
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User tidak ditemukan"
      });
    }

    if (!user.active) {
      return res.status(401).json({
        status: "error",
        message: "Akun Anda tidak aktif"
      });
    }

    // Attach user ke request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "Token tidak valid"
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token sudah kadaluarsa. Silakan login kembali"
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

module.exports = { protect };