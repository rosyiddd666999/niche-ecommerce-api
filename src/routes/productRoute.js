const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

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
router.post("/", protect, createProductValidation, createProduct);
router.put("/:id", protect, updateProductValidation, requireAtLeastOneChange, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;