const { Product } = require("../models/index.js");
const cloudinary = require("../config/cloudinary.js");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const uploadImage = upload.fields([
  { name: "image_cover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({
      status: "success",
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Products by id fetched successfully",
      data: product,
    });
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

    let imageCoverUrl = null;
    if (req.files.image_cover) {
      const result = await cloudinary.uploader.upload(
        req.files.image_cover[0].path,
        { folder: "products" }
      );
      imageCoverUrl = result.secure_url;
      fs.unlinkSync(req.files.image_cover[0].path); // after upload cloudinary, delete file from multer store
    }

    let imageUrls = [];
    if (req.files.images) {
      for (const img of req.files.images) {
        const result = await cloudinary.uploader.upload(img.path, {
          folder: "products/gallery",
        });
        imageUrls.push(result.secure_url);
        fs.unlinkSync(img.path);
      }
    }

    const product = await Product.create({
      title: req.body.title,
      slug: req.body.title.toLowerCase().replace(/ /g, "-"),
      description: req.body.description,
      quatity: req.body.quantity,
      price: req.body.price,
      colors: req.body.colors,
      image_cover: imageCoverUrl,
      images: imageUrls,
      category_id: req.body.category_id,
      brand_id: req.body.brand_id,
      discount: req.body.discount,
      ratings_average: req.body.ratings_average,
      ratings_quantity: req.body.ratings_quantity,
    });
    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update image if new image is provided
    let newCoverUrl = product.image_cover;
    if (req.files.image_cover) {
      const result = await cloudinary.uploader.upload(
        req.files.image_cover[0].path,
        { folder: "products" }
      );
      newCoverUrl = result.secure_url;
      fs.unlinkSync(req.files.image_cover[0].path);
    }

    let newImageUrls = product.images || [];
    if (req.files.images) {
      newImageUrls = [];
      for (const img of req.files.images) {
        const result = await cloudinary.uploader.upload(img.path, {
          folder: "products/gallery",
        });
        newImageUrls.push(result.secure_url);
        fs.unlinkSync(img.path);
      }
    }

    const updatedProduct = await Product.update(
      {
        title: req.body.title,
        slug: req.body.title.toLowerCase().replace(/ /g, "-"),
        description: req.body.description,
        quatity: req.body.quantity,
        price: req.body.price,
        colors: req.body.colors,
        image_cover: newCoverUrl,
        images: newImageUrls,
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
    res.status(201).json({
      status: "success",
      message: "Products updated successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image_cover) {
      const publicId = product.image_cover.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    if (product.images && product.images.length) {
      for (const url of product.images) {
        const publicId = url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/gallery/${publicId}`);
      }
    }
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id },
    });
    res.clearCookie("jwt");
    res.status(201).json({
      status: "success",
      message: "Product deleted successfully",
      data: deletedProduct,
    });
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
  uploadImage,
};
