const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require("../utils/validations/authValidation");

const {
  authLimiter,
  forgotPasswordLimiter
} = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", authLimiter, signupValidation, signUp);
router.post("/login", authLimiter, loginValidation, login);
router.post("/logout", protect, logout);
router.post("/forgot-password", forgotPasswordLimiter, forgotPasswordValidation, forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordValidation, resetPassword);

module.exports = router;