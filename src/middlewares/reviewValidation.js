const {body, validationResult} = require("express-validator");
const {Review, Product, User} = require("../models/index.js");

// Middleware to handle validation errors
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

const reviewValidationRules = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isString().withMessage("Comment must be a string"),
  body("product_id")
    .notEmpty()
    .withMessage("Product id is required")
    .isInt()
    .withMessage("Product id must be an integer")
    .custom(async (productId, { req }) => {
      const product = await Product.findByPk(productId);
      if (!product) throw new Error("Product not found");
      return true;
    }),
  body("user_id")
    .notEmpty()
    .withMessage("User id is required")
    .isInt()
    .withMessage("User id must be an integer")
    .custom(async (userId, { req }) => {
      const user = await User.findByPk(userId);
      if (!user) throw new Error("User not found");
      return true;
    }),
  handleValidationErrors,
];

module.exports = {handleValidationErrors, reviewValidationRules};