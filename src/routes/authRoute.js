const express = require("express");
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
} = require("../middlewares/authValidation");

const {
  authLimiter,
  forgotPasswordLimiter
} = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", authLimiter, signupValidation, signUp);
router.post("/login", authLimiter, loginValidation, login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPasswordLimiter, forgotPasswordValidation, forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordValidation, resetPassword);

module.exports = router;