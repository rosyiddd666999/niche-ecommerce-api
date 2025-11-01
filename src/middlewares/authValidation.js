const { body, validationResult } = require("express-validator");

// Middleware untuk handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Validation rules untuk signup
const signupValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Nama harus diisi")
    .isLength({ min: 3 }).withMessage("Nama minimal 3 karakter"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("Email harus diisi")
    .isEmail().withMessage("Format email tidak valid")
    .normalizeEmail(),
  
  body("password")
    .notEmpty().withMessage("Password harus diisi")
    .isLength({ min: 8 }).withMessage("Password minimal 8 karakter")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage(
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    ),
  
  handleValidationErrors
];

// Validation rules untuk login
const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email harus diisi")
    .isEmail().withMessage("Format email tidak valid")
    .normalizeEmail(),
  
  body("password")
    .notEmpty().withMessage("Password harus diisi"),
  
  handleValidationErrors
];

// Validation rules untuk forgot password
const forgotPasswordValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email harus diisi")
    .isEmail().withMessage("Format email tidak valid")
    .normalizeEmail(),
  
  handleValidationErrors
];

// Validation rules untuk reset password
const resetPasswordValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email harus diisi")
    .isEmail().withMessage("Format email tidak valid")
    .normalizeEmail(),
  
  body("otp")
    .trim()
    .notEmpty().withMessage("Kode OTP harus diisi")
    .isLength({ min: 6, max: 6 }).withMessage("Kode OTP harus 6 digit")
    .isNumeric().withMessage("Kode OTP harus berupa angka"),
  
  body("newPassword")
    .notEmpty().withMessage("Password baru harus diisi")
    .isLength({ min: 8 }).withMessage("Password minimal 8 karakter")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage(
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    ),
  
  handleValidationErrors
];

module.exports = {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
};