const express = require("express");
const { protect, isAdmin } = require("../middlewares/core/authMiddleware");

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController.js");

const {
  createCategoryValidation,
  updateCategoryValidation,
} = require("../middlewares/categoryValidation.js");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", protect, isAdmin, createCategoryValidation, createCategory);
router.put("/:id", protect, isAdmin, updateCategoryValidation, updateCategory);
router.delete("/:id", protect , isAdmin, deleteCategory);

module.exports = router;
