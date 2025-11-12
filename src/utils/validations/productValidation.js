const { body, validationResult } = require("express-validator");
const { Product } = require("../../models/index.js");

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
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters long"),
  
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  
  body("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be integer >= 0"),
  
  body("price_after_discount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number"),
  
  body("colors")
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
          return true;
        } catch (e) {
          throw new Error('Colors must be valid JSON array');
        }
      }
      return Array.isArray(value);
    })
    .withMessage("Colors must be an array or valid JSON"),
  
  body("category_id")
    .notEmpty()
    .withMessage("Category id is required")
    .isInt()
    .withMessage("Category id must be an integer"),
  
  body("ratings_average")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Ratings average must be between 0-5"),
  
  body("ratings_quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Ratings quantity must be integer >= 0"),
  
  // Validasi file upload (after multer process)
  (req, res, next) => {
    if (!req.files || !req.files.image_cover) {
      return res.status(400).json({
        status: "error",
        errors: [{ field: "image_cover", message: "Image cover is required" }],
      });
    }
    next();
  },
  
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
    .isNumeric()
    .withMessage("Price must be a number"),
  
  body("price_after_discount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number"),
  
  body("colors")
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
          return true;
        } catch (e) {
          throw new Error('Colors must be valid JSON array');
        }
      }
      return Array.isArray(value);
    }),
  
  body("category_id")
    .optional()
    .isInt()
    .withMessage("Category id must be an integer"),
  
  handleValidationErrors,
];

const requireAtLeastOneChange = (updatableFields = [
  "title",
  "description",
  "quantity",
  "price",
  "price_after_discount",
  "colors",
  "image_cover",
  "images",
  "category_id",
]) => {
  return async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id)
        return res.status(400).json({ 
          status: "error", 
          message: "Missing id param" 
        });

      const product = await Product.findByPk(id);
      if (!product)
        return res.status(404).json({ 
          status: "error", 
          message: "Product not found" 
        });

      // Check fields sent in body
      const sentFields = Object.keys(req.body).filter((f) =>
        updatableFields.includes(f)
      );
      
      // Jika ada file upload, dianggap ada perubahan
      if (req.files && (req.files.image_cover || req.files.images)) {
        return next();
      }

      if (sentFields.length === 0) {
        return res.status(400).json({ 
          status: "error", 
          message: "No updatable fields provided" 
        });
      }

      // Compare values of sent fields
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