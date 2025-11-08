const express = require("express");
const { protect, isAdmin } = require("../middlewares/authMiddleware");

const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

const { createCouponValidation, updateCouponValidation } = require("../utils/validations/couponValidation");

const router = express.Router();

router.get("/", getCoupons);
router.post("/", protect, isAdmin, createCouponValidation, createCoupon);
router.put("/:id", protect, isAdmin, updateCouponValidation, updateCoupon);
router.delete("/:id", protect, isAdmin, deleteCoupon);

module.exports = router;