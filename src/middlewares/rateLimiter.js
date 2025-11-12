const rateLimit = require("express-rate-limit");

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: {
    status: "error",
    message: "Terlalu banyak percobaan dari IP ini, silakan coba lagi setelah 15 menit"
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: false,
  // Skip failed requests (optional, set to true if failed requests should not count)
  skipFailedRequests: false,
});

// Rate limiter for forgot password endpoint
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 3,
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