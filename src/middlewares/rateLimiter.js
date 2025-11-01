const rateLimit = require("express-rate-limit");

// Rate limiter untuk auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // maksimal 5 request per windowMs
  message: {
    status: "error",
    message: "Terlalu banyak percobaan dari IP ini, silakan coba lagi setelah 15 menit"
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: false,
  // Skip failed requests (optional, set to true jika ingin hanya menghitung failed attempts)
  skipFailedRequests: false,
});

// Rate limiter khusus untuk forgot password (lebih ketat)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 3, // maksimal 3 request per windowMs
  message: {
    status: "error",
    message: "Terlalu banyak permintaan reset password dari IP ini, silakan coba lagi setelah 15 menit"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  forgotPasswordLimiter
};