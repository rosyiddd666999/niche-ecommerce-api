const { sequelize } = require("../config/database");

// model factories
const UserModel = require("./userModel");
const CategoryModel = require("./categoryModel");
const ProductModel = require("./productModel");
const ReviewModel = require("./reviewModel");
const CartModel = require("./cartModel");
const CartItemModel = require("./cartItemModel");
const CouponModel = require("./couponModel");
const OrderModel = require("./orderModel");
const OrderItemModel = require("./orderItemModel");

// instantiate models
const User = UserModel(sequelize);
const Category = CategoryModel(sequelize);
const Product = ProductModel(sequelize);
const Review = ReviewModel(sequelize);
const Cart = CartModel(sequelize);
const CartItem = CartItemModel(sequelize);
const Coupon = CouponModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);

// Associations

// Product <-> Category
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Product <-> Review
Product.hasMany(Review, { foreignKey: "product_id", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// User <-> Review
User.hasMany(Review, { foreignKey: "user_id", as: "reviews" });
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Cart & Items
User.hasOne(Cart, { foreignKey: "user_id", as: "cart" });
Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });

Cart.hasMany(CartItem, { foreignKey: "cart_id", as: "items", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id", as: "cart" });

Product.hasMany(CartItem, { foreignKey: "product_id", as: "cart_items" });
CartItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Order & Items
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

Product.hasMany(OrderItem, { foreignKey: "product_id", as: "order_items" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Coupon relation (optional use)
Coupon.belongsTo(User, { foreignKey: "created_by", as: "creator" });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Review,
  Cart,
  CartItem,
  Coupon,
  Order,
  OrderItem,
};