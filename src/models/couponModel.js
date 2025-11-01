const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Coupon",
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      expire: { type: DataTypes.DATE, allowNull: false },
      discount: { type: DataTypes.FLOAT, allowNull: false }, // percent or fixed (define in logic)
      created_by: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    },
    { tableName: "coupons", underscored: true }
  );
};
