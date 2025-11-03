require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import db & models
const { dbConnection, sequelize } = require("./src/config/database.js");

// Import routes
const AuthRoute = require("./src/routes/authRoute.js");
const UserRoute = require("./src/routes/userRoute.js");
const ProductRoute = require("./src/routes/productRoute.js");
const CartRoute = require("./src/routes/cartRoute.js");

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/products", ProductRoute);
app.use("/api/cart", CartRoute);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Shoe Store API is running",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT;

(async () => {
  try {
    await dbConnection();

    await sequelize.sync({
      alter: process.env.NODE_ENV === "development",
    });

    console.log("All models synced with DB.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
})();