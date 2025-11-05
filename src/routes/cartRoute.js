const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const {
  getCart,
  addProductToCart,
  updateCartItem,
  deleteCartItem,
  clearAllCart,
} = require("../controllers/cartController.js");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addProductToCart);
router.put("/update/:cartItemId", protect, updateCartItem);
router.delete("/delete/:cartItemId", protect, deleteCartItem);
router.delete("/clear", protect, clearAllCart);

module.exports = router;