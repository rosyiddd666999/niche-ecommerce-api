const express = require("express");
const { protect, isAdmin } = require("../middlewares/core/authMiddleware");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController.js");

const {
  createProductValidation,
  updateProductValidation,
  requireAtLeastOneChange,
} = require("../middlewares/productValidation.js");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protect, isAdmin, createProductValidation, createProduct);
router.put("/:id", protect, isAdmin, updateProductValidation, requireAtLeastOneChange, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;