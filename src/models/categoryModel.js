const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Category",
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { len: [3, 32] } },
      slug: { type: DataTypes.STRING, allowNull: true, set(v) { if (v) this.setDataValue("slug", v.toLowerCase()); } },
      image: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: "categories",
      underscored: true,
      hooks: {
        afterFind: (result) => {
          const base = process.env.Base_URL || "";
          const set = (r) => { if (r && r.image) r.image = `${base}/categories/${r.image}`; };
          if (Array.isArray(result)) result.forEach(set); else set(result);
        },
      },
    }
  );
};
