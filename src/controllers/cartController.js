const { Cart, Product, CartItem } = require("../models/index.js");

const addProductToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({
        user_id: userId,
        total_cart_price: 0,
        total_price_after_discount: 0,
      });
    }

    const cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id: product.id,
      },
    });

    if (cartItem) {
      // Update quantity jika sudah ada
      const newQuantity = cartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          status: "error",
          message: `Stock tidak cukup. Stock tersedia: ${product.stock}, sudah di cart: ${cartItem.quantity}`,
        });
      }

      cartItem.quantity = newQuantity;
      await cartItem.save();

      return res.status(200).json({
        status: "success",
        message: "Quantity produk di cart berhasil diupdate",
        data: {
          cart_item: cartItem,
        },
      });
    } else {
      // Tambah item baru
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id: product.id,
        quantity: quantity,
      });

      return res.status(201).json({
        status: "success",
        message: "Produk berhasil ditambahkan ke cart",
        data: {
          cart_item: cartItem,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "slug", "price", "quantity"],
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    const cartItems = cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: item.product,
    }));

    res.status(200).json({
      status: "success",
      data: {
        cart_id: cart.id,
        items: cartItems,
        total_items: cartItems.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { user_id: userId },
        },
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        status: "error",
        message: "Cart item tidak ditemukan",
      });
    }

    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: `Stock tidak cukup. Stock tersedia: ${cartItem.product.stock}`,
      });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      status: "success",
      message: "Quantity berhasil diupdate",
      data: {
        cart_item: cartItem,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;

    // Cari cart item dan pastikan milik user yang login
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { user_id: userId },
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        status: "error",
        message: "Cart item tidak ditemukan",
      });
    }
    await cartItem.destroy();
    res.status(200).json({
      status: "success",
      message: "Cart item deleted successfully",
      data: cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const clearAllCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart tidak ditemukan",
      });
    }

    // Clear all items
    await CartItem.destroy({ where: { cart_id: cart.id } });

    res.status(200).json({
      status: "success",
      message: "Cart berhasil dikosongkan",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  addProductToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearAllCart,
};
