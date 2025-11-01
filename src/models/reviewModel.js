const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Review",
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      user_name: { type: DataTypes.STRING(150), allowNull: false },
      rating: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { min: 1, max: 5 } },
      comment: { type: DataTypes.TEXT, allowNull: true },
      // foreign keys: user_id, product_id - set by associations
    },
    {
      tableName: "reviews",
      underscored: true,
    }
  );
};
