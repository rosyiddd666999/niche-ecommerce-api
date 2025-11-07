const express = require("express");
const { protect } = require("../middlewares/core/authMiddleware");

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
router.get("/:id", protect, getOrderById);
router.get("/", protect, getUserOrders);
router.get("/:orderId/success", protect, successOrderPayment);

module.exports = router;
