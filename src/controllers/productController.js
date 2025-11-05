const { Product } = require("../models/index.js");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(
      {
        status: "success",
        message: "Products fetched successfully",
        data: products,
      },
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    res.status(200).json(
      {
        status: "success",
        message: "Products by id fetched successfully",
        data: product,
      },
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findOne({
      where: {
        title: req.body.title,
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        status: "error",
        message: "Product already exists",
      });
    }

    const product = await Product.create({
      title: req.body.title,
      slug: req.body.title.toLowerCase().replace(/ /g, "-"),
      description: req.body.description,
      quatity: req.body.quantity,
      price: req.body.price,
      colors: req.body.colors,
      image_cover: req.body.image_cover,
      images: req.body.images,
      category_id: req.body.category_id,
      brand_id: req.body.brand_id,
      discount: req.body.discount,
      ratings_average: req.body.ratings_average,
      ratings_quantity: req.body.ratings_quantity,
    });
    res.status(201).json(
      {
        status: "success",
        message: "Product created successfully",
        data: product,
      },
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.update(
      {
        title: req.body.title,
        slug: req.body.title.toLowerCase().replace(/ /g, "-"),
        description: req.body.description,
        quatity: req.body.quantity,
        price: req.body.price,
        colors: req.body.colors,
        image_cover: req.body.image_cover,
        images: req.body.images,
        category_id: req.body.category_id,
        brand_id: req.body.brand_id,
        discount: req.body.discount,
        ratings_average: req.body.ratings_average,
        ratings_quantity: req.body.ratings_quantity,
      },
      {
        where: { id: req.params.id },
      }
    );
    const product = await Product.findByPk(req.params.id);
    res.status(201).json(
      {
        status: "success",
        message: "Products updated successfully",
        data: product,
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id },
    });
    res.clearCookie("jwt");
    res.status(201).json(
      {
        status: "success",
        message: "Product deleted successfully",
        data: deletedProduct,
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
