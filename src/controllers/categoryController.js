const { Category } = require("../models/index.js");
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

const uploadImage = upload.fields([{ name: "category_image", maxCount: 1 }]);

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      status: "success",
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const existingCategory = await Category.findOne({
      where: { name: req.body.name },
    });

    if (existingCategory) {
      return res.status(400).json({
        status: "error",
        message: "Category already exists",
      });
    }

    let imageUrl = null;
    if (req.files.category_image) {
      const result = await cloudinary.uploader.upload(
        req.files.category_image[0].path,
        { folder: "categories" }
      );
      imageUrl = result.secure_url;
      fs.unlinkSync(req.files.category_image[0].path);
    }

    const category = await Category.create({
      name: req.body.name,
      slug: req.body.name.toLowerCase().replace(/ /g, "-"),
      image: imageUrl,
    });
    res.status(201).json({
      status: "success",
      message: "Categories added successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let newImageUrl = category.image;
    if (req.files.category_image) {
      const result = await cloudinary.uploader.upload(
        req.files.category_image[0].path,
        { folder: "categories" }
      );
      newImageUrl = result.secure_url;
      fs.unlinkSync(req.files.category_image[0].path);
    }

    await category.update({
      name: req.body.name,
      slug: req.body.name.toLowerCase().replace(/ /g, "-"),
      image: newImageUrl,
    });
    res.status(200).json({
      status: "success",
      message: "Categories updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.image) {
      const publicId = category.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`categories/${publicId}`);
    }
    
    await category.destroy();
    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
};
