// validators/cartValidators.js
const { body, param, validationResult } = require("express-validator");
const { Product, CartItem } = require("../../models/index.js");
const {
  handleValidationErrors,
} = require("../../middlewares/errorsValidationHandling.js");

/**
 * ADD item to cart
 * - productId required, integer, product must exist
 * - quantity required, integer >= 1, tidak boleh melebihi stok produk
 */
const addCartItemValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product id is required")
    .bail()
    .isInt()
    .withMessage("Product id must be an integer")
    .bail()
    .custom(async (productId, { req }) => {
      const product = await Product.findByPk(productId);
      if (!product) throw new Error("Product not found");
      const qty = Number(req.body.quantity ?? 0);
      if (!Number.isInteger(qty) || qty < 1) {
        return true;
      }
      if (product.quantity < qty) {
        throw new Error(`Insufficient stock. Available: ${product.quantity}`);
      }
      return true;
    }),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  handleValidationErrors,
];

/**
 * UPDATE cart item
 * - requireActualChange middleware memastikan data baru memang berbeda dari DB
 */
const updateCartItemValidation = [
  param("cartItemId")
    .notEmpty()
    .withMessage("Cart item id is required")
    .bail()
    .isInt()
    .withMessage("Cart item id must be an integer"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer >= 1"),
  handleValidationErrors,
];

const requireActualChange = (updatableFields = ["quantity"]) => {
  return async (req, res, next) => {
    try {
      const cartItemId = req.params.cartItemId;
      if (!cartItemId) {
        return res.status(400).json({ status: "error", message: "Missing cartItemId param" });
      }

      const cartItem = await CartItem.findByPk(cartItemId);
      if (!cartItem) {
        return res.status(404).json({ status: "error", message: "Cart item not found" });
      }

      // tentukan fields yang dikirim dan termasuk updatable
      const sentFields = Object.keys(req.body).filter((f) => updatableFields.includes(f));
      if (sentFields.length === 0) {
        return res.status(400).json({ status: "error", message: "No updatable fields provided" });
      }

      const changed = sentFields.some((field) => {
        const oldVal = cartItem.get(field);
        const newVal = req.body[field];

        if (Array.isArray(oldVal) || typeof oldVal === "object") {
          try {
            return JSON.stringify(oldVal) !== JSON.stringify(newVal);
          } catch {
            return true;
          }
        }
        return String(oldVal) !== String(newVal);
      });

      if (!changed) {
        return res.status(400).json({ status: "error", message: "No changes detected compared to existing cart item" });
      }

      if (sentFields.includes("quantity")) {
        const newQty = Number(req.body.quantity);
        const product = await Product.findByPk(cartItem.productId);
        if (!product) {
          return res.status(404).json({ status: "error", message: "Related product not found" });
        }
        if (product.quantity < newQty) {
          return res.status(400).json({ status: "error", message: `Insufficient stock. Available: ${product.quantity}` });
        }
      }

      req.cartItem = cartItem;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };
};

const checkOwnershipOrThrow = (getUserIdFromReq = (req) => req.user?.id) => {
  return async (req, res, next) => {
    try {
      const cartItemId = req.params.cartItemId;
      const cartItem = await CartItem.findByPk(cartItemId);
      if (!cartItem) return res.status(404).json({ status: "error", message: "Cart item not found" });

      const userId = getUserIdFromReq(req);
      if (!userId || String(cartItem.userId) !== String(userId)) {
        return res.status(403).json({ status: "error", message: "Forbidden: you cannot access this cart item" });
      }

      req.cartItem = cartItem;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  };
};

module.exports = {
  handleValidationErrors,
  addCartItemValidation,
  updateCartItemValidation,
  requireActualChange,
  checkOwnershipOrThrow,
};
