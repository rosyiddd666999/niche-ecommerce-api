const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      tax_price: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      shipping_address: { type: DataTypes.JSON, allowNull: true },
      shipping_price: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      total_order_price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      payment_method_type: {
        type: DataTypes.ENUM("cash", "midtrans"),
        defaultValue: "cash",
      },
      payment_transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
      }, // From Midtrans
      payment_status: {
        type: DataTypes.ENUM(
          "pending",
          "settlement",
          "cancel",
          "expire",
          "deny"
        ),
        defaultValue: "pending",
      },
      snap_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_paid: { type: DataTypes.BOOLEAN, defaultValue: false },
      paid_at: { type: DataTypes.DATE, allowNull: true },
      is_delivered: { type: DataTypes.BOOLEAN, defaultValue: false },
      delivered_at: { type: DataTypes.DATE, allowNull: true },
      // user_id via association
    },
    { tableName: "orders", underscored: true }
  );
};
