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

const createCategoryValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 100 })
      .withMessage("Name must be at most 100 characters long"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Description must be a string")
      .isLength({ max: 255 })
      .withMessage("Description must be at most 255 characters long"),
    handleValidationErrors,
  ];
};

const updateCategoryValidation = () => {
  return [
    body("name")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 100 })
      .withMessage("Name must be at most 100 characters long"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
      .isLength({ max: 255 })
      .withMessage("Description must be at most 255 characters long"),
    handleValidationErrors,
  ];
};

module.exports = {
  handleValidationErrors,
  createCategoryValidation,
  updateCategoryValidation,
};
