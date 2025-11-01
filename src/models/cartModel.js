const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Cart",
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      total_cart_price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      total_price_after_discount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      // user_id via association
    },
    { tableName: "carts", underscored: true }
  );
};
