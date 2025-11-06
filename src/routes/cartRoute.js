const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const {
  getCart,
  addProductToCart,
  updateCartItem,
  deleteCartItem,
  clearAllCart,
} = require("../controllers/cartController.js");

const {
  addCartItemValidation,
  updateCartItemValidation,
  requireActualChange,
  checkOwnershipOrThrow,
} = require("../middlewares/cartValidation.js");

const router = express.Router();

router.get("/", protect, checkOwnershipOrThrow, getCart);
router.post("/add", protect, addCartItemValidation, addProductToCart);
router.put("/update/:cartItemId", protect, updateCartItemValidation, requireActualChange, updateCartItem);
router.delete("/delete/:cartItemId", protect, deleteCartItem);
router.delete("/clear", protect, clearAllCart);

module.exports = router;