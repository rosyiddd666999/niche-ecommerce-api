const express = require("express");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
} = require("../controllers/categoryController.js");

const {
  createCategoryValidation,
  updateCategoryValidation,
} = require("../utils/validations/categoryValidation.js");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post(
  "/",
  protect,
  isAdmin,
  uploadImage,
  createCategoryValidation,
  createCategory
);
router.put(
  "/:id",
  protect,
  isAdmin,
  uploadImage,
  updateCategoryValidation,
  updateCategory
);
router.delete("/:id", protect, isAdmin, deleteCategory);

module.exports = router;
