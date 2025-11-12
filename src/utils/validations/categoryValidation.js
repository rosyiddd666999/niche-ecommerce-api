const { body, validationResult } = require("express-validator");
const {
  handleValidationErrors,
} = require("../../middlewares/errorsValidationHandling.js");

const createCategoryValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters long"),
  (req, res, next) => {
    if (req.files || !req.body.image) {
      return res
        .status(400)
        .json({ status: "error", message: "Image is required" });
    }
    next();
  },
  handleValidationErrors,
];

const updateCategoryValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters long"),
  (req, res, next) => {
    if (req.files || !req.body.image) {
      return res
        .status(400)
        .json({ status: "error", message: "Image is required" });
    }
    next();
  },
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  createCategoryValidation,
  updateCategoryValidation,
};
