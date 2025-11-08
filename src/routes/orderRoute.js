const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const {
  createOrderByCart,
  handleMidtransNotification,
  getOrderById,
  getUserOrders,
  successOrderPayment,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/cart/:cartId/checkout", protect, createOrderByCart);
router.post("/notification", handleMidtransNotification); 
router.get("/user/orders", protect, getUserOrders); 
router.get("/:id/success", successOrderPayment); 
router.get("/:id", protect, getOrderById);

module.exports = router;