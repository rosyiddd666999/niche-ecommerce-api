const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController.js");

const {
    createCategoryValidation,
    updateCategoryValidation
} = require("../middlewares/categoryValidation.js");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", protect, createCategoryValidation, createCategory);
router.put("/:id", protect, updateCategoryValidation, updateCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;