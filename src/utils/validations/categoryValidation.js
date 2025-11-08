const { body, validationResult } = require("express-validator");

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

const createCategoryValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters long"),
  body("image").isURL().withMessage("Image must be a valid URL"),
  handleValidationErrors,
];

const updateCategoryValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters long"),
  body("image").optional().isURL().withMessage("Image must be a valid URL"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  createCategoryValidation,
  updateCategoryValidation,
};
