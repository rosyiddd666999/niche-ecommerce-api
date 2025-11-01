const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "OrderItem",
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
      color: { type: DataTypes.STRING, allowNull: true },
      price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      // order_id, product_id via associations
    },
    { tableName: "order_items", underscored: true }
  );
};
