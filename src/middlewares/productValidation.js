const { body, validationResult } = require("express-validator");
const { Product } = require("../models/index.js");

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

const createProductValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({
      min: 3,
    })
    .withMessage("Title must be at least 3 characters long"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long"),
  body("price").notEmpty().withMessage("Price is required"),
  body("colors").optional().isArray().withMessage("Colors must be an array"),
  body("image_cover")
    .notEmpty()
    .withMessage("Image cover is required")
    .isURL()
    .withMessage("Image cover must be a valid URL"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("category_id").notEmpty().withMessage("Category id is required"),
  handleValidationErrors,
];

const updateProductValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long"),
  body("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be integer >= 0"),
  body("price")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Price must be integer >= 0"),
  body("colors").optional().isArray().withMessage("Colors must be an array"),
  body("image_cover")
    .optional()
    .isURL()
    .withMessage("Image cover must be a valid URL"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("category_id")
    .optional()
    .isInt()
    .withMessage("Category id must be an integer"),
  handleValidationErrors,
];

const requireAtLeastOneChange = (
  updatableFields = [
    "title",
    "description",
    "quantity",
    "price",
    "colors",
    "image_cover",
    "images",
    "category_id",
  ]
) => {
  return async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id)
        return res
          .status(400)
          .json({ status: "error", message: "Missing id param" });

      const product = await Product.findByPk(id);
      if (!product)
        return res
          .status(404)
          .json({ status: "error", message: "Product not found" });

      // check fields sent in body
      const sentFields = Object.keys(req.body).filter((f) =>
        updatableFields.includes(f)
      );
      if (sentFields.length === 0) {
        return res
          .status(400)
          .json({ status: "error", message: "No updatable fields provided" });
      }

      // compare values of sent fields
      const changed = sentFields.some((field) => {
        const oldVal = product.get(field);
        const newVal = req.body[field];

        if (Array.isArray(oldVal) || typeof oldVal === "object") {
          try {
            return JSON.stringify(oldVal) !== JSON.stringify(newVal);
          } catch (e) {
            return true;
          }
        }

        return String(oldVal) !== String(newVal);
      });

      if (!changed) {
        return res.status(400).json({
          status: "error",
          message: "No changes detected compared to existing data",
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = {
  handleValidationErrors,
  createProductValidation,
  updateProductValidation,
  requireAtLeastOneChange,
};
