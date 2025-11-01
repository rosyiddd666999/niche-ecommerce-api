const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "CartItem",
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
      color: { type: DataTypes.STRING, allowNull: true },
      price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      // cart_id, product_id via associations
    },
    { tableName: "cart_items", underscored: true }
  );
};
