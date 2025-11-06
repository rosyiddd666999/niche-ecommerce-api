const { Review, Product, User } = require("../models/index.js");

const getReviewsByProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    const reviews = await Review.findAll({
      where: { product_id: product.id },
    });

    res
      .status(200)
      .json({ message: "Reviews fetched successfully", data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const review = await Review.create({
      product_id: productId,
      user_id: userId,
      rating,
      comment,
    });
    res
      .status(201)
      .json({ message: "Review created successfully", data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    await review.update({
      rating: req.body.rating,
      comment: req.body.comment,
    });
    res
      .status(200)
      .json({ message: "Review updated successfully", data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    await review.destroy();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
};
