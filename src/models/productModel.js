const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(200), allowNull: false, validate: { len: [3, 200] } },
      slug: { type: DataTypes.STRING, allowNull: false, set(v) { this.setDataValue("slug", (v || "").toLowerCase()); } },
      description: { type: DataTypes.TEXT, allowNull: false, validate: { len: [20, 5000] } },
      quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      sold: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { max: 200000000 } },
      price_after_discount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      colors: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
      image_cover: { type: DataTypes.STRING, allowNull: false },
      images: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
      ratings_average: { type: DataTypes.FLOAT, allowNull: true, validate: { min: 1.0, max: 5.0 } },
      ratings_quantity: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
      // category_id will be added by association
    },
    {
      tableName: "products",
      underscored: true,
      hooks: {
        afterFind: (result) => {
          const base = process.env.Base_URL || "";
          const setImageURL = (doc) => {
            if (!doc) return;
            if (doc.image_cover) doc.image_cover = `${base}/products/${doc.image_cover}`;
            if (Array.isArray(doc.images)) doc.images = doc.images.map((i) => `${base}/products/${i}`);
          };
          if (Array.isArray(result)) result.forEach(setImageURL); else setImageURL(result);
        },
        afterCreate: (doc) => {
          const base = process.env.Base_URL || "";
          if (doc.image_cover) doc.image_cover = `${base}/products/${doc.image_cover}`;
          if (Array.isArray(doc.images)) doc.images = doc.images.map((i) => `${base}/products/${i}`);
        },
      },
    }
  );

  return Product;
};