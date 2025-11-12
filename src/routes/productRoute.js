const express = require("express");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController.js");

const {
  createProductValidation,
  updateProductValidation,
  requireAtLeastOneChange,
} = require("../utils/validations/productValidation.js");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  protect,
  isAdmin,
  uploadImage,
  createProductValidation,
  createProduct
);
router.put(
  "/:id",
  protect,
  isAdmin,
  uploadImage,
  requireAtLeastOneChange,
  updateProductValidation,
  updateProduct
);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
