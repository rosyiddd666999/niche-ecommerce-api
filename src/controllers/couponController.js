const { Coupon } = require("../models/index.js");

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res
      .status(200)
      .json({ message: "Coupons fetched successfully", data: coupons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { name, expire, discount } = req.body;
    const createdBy = req.user ? req.user.id : null;
    const coupon = await Coupon.create({
      name,
      expire,
      discount,
      created_by: createdBy,
    });
    res.status(201).json({
      status: "success",
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    await coupon.update(req.body);
    res.status(200).json({
      status: "success",
      message: "Coupon updated successfully",
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    await coupon.destroy();
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCoupon, getCoupons, updateCoupon, deleteCoupon };
