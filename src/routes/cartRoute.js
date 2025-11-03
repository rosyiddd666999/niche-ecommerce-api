const express = require("express");

const {
  getCart,
  addProductToCart,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/cartController.js");
const router = require("./authRoute");

const router = express.Router();

router.get("/", getCart);
router.post("/add", addProductToCart);
router.put("/update/:cartItemId", updateCartItem);
router.delete("/delete/:cartItemId", deleteCartItem);

module.exports = router;
