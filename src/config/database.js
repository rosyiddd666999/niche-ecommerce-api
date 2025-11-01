const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      multipleStatements: process.env.MULTIPLESTATEMENTS === "true",
    },
    logging: false,
    define: { 
      underscored: true, 
      timestamps: true 
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ DB connected: ${process.env.DB_HOST || "localhost"}`);
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    throw err;
  }
};

module.exports = { sequelize, dbConnection };