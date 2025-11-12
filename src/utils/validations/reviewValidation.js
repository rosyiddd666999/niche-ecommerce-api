const { body, validationResult } = require("express-validator");
const {
  handleValidationErrors,
} = require("../../middlewares/errorsValidationHandling.js");

const reviewValidationRules = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isString().withMessage("Comment must be a string"),
  handleValidationErrors,
];

module.exports = { handleValidationErrors, reviewValidationRules };
