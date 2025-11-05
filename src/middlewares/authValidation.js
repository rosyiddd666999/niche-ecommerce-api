const { body, validationResult } = require("express-validator");

// Middleware untuk handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Validation rules untuk signup
const signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nama harus diisi")
    .isLength({ min: 3 })
    .withMessage("Nama minimal 3 karakter"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email harus diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password harus diisi")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    ),
  body("password_confirm")
    .notEmpty()
    .withMessage("Konfirmasi password harus diisi")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password dan konfirmasi password tidak cocok");
      }
      return true;
    }),
  body("profile_img")
    .optional()
    .isURL()
    .withMessage("Profile image harus berupa URL yang valid"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Nomor telepon tidak valid"),
  body("addresses")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Addresses harus berupa array dan minimal 1 data"),
  body("addresses.*.street").notEmpty().withMessage("Alamat jalan harus diisi"),
  body("addresses.*.phone")
    .notEmpty()
    .withMessage("Nomor telepon harus diisi")
    .isMobilePhone("id-ID")
    .withMessage("Nomor telepon tidak valid"),
  body("addresses.*.city").notEmpty().withMessage("Kota harus diisi"),
  body("addresses.*.postal_code")
    .notEmpty()
    .withMessage("Kode pos harus diisi")
    .isPostalCode("ID")
    .withMessage("Kode pos tidak valid"),
  handleValidationErrors,
];

// Validation rules untuk login
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email harus diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password harus diisi"),

  handleValidationErrors,
];

// Validation rules untuk forgot password
const forgotPasswordValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email harus diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),

  handleValidationErrors,
];

// Validation rules untuk reset password
const resetPasswordValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email harus diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage("Kode OTP harus diisi")
    .isLength({ min: 6, max: 6 })
    .withMessage("Kode OTP harus 6 digit")
    .isNumeric()
    .withMessage("Kode OTP harus berupa angka"),

  body("newPassword")
    .notEmpty()
    .withMessage("Password baru harus diisi")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    ),

  handleValidationErrors,
];

module.exports = {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
