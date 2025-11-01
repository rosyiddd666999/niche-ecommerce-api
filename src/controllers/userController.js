const { User } = require("../models/index.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(201).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email sudah terdaftar",
      });
    }

    const slug = req.body.name.toLowerCase().replace(/ /g, "-");

    const createdUser = await User.create({
      name: req.body.name,
      slug: slug,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      profileImg: req.body.profileImg ?? "",
      role: req.body.role,
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.update(
      {
        name: req.body.name,
        slug: req.body.name.toLowerCase().replace(/ /g, "-"),
        phone: req.body.phone,
        email: req.body.email,
        profileImg: req.body.profileImg,
        role: req.body.role,
      },
      {
        where: { id: req.params.id },
      }
    );
    const user = await User.findByPk(req.params.id);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.destroy({
      where: { id: req.params.id },
    });
    res.clearCookie("jwt");
    res.status(201).json(
      {
        status: "success",
        message: "User deleted successfully",
      },
      deletedUser
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
