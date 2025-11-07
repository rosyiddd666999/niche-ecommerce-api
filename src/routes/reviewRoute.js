const express = require("express");
const { protect } = require("../middlewares/core/authMiddleware");

const {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController.js");

const {
  reviewValidationRules
} = require("../middlewares/reviewValidation.js");

const router = express.Router();

router.post("/", protect, reviewValidationRules, createReview);
router.get("/product/:productId", getReviewsByProduct);
router.put("/:id", protect, reviewValidationRules, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;