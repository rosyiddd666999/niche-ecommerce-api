require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const morgan = require("morgan");

// Import db & models
const { dbConnection, sequelize } = require("./src/config/database.js");

const { apiKeyAuth } = require("./src/middlewares/apiKeyAuth.js");
const { errorHandler } = require("./src/middlewares/errorHandler.js");
const { sanitize } = require("./src/middlewares/sanitize.js");

// Import routes
const AuthRoute = require("./src/routes/authRoute.js");
const UserRoute = require("./src/routes/userRoute.js");
const ProductRoute = require("./src/routes/productRoute.js");
const CartRoute = require("./src/routes/cartRoute.js");
const CategoryRoute = require("./src/routes/categoryRoute.js");
const ReviewRoute = require("./src/routes/reviewRoute.js");
const CouponRoute = require("./src/routes/couponRoute.js");
const OrderRoute = require("./src/routes/orderRoute.js");

const app = express();

app.set("trust proxy", 1);

// Security Middlewares
app.use(helmet()); // Set security HTTP headers
app.use(hpp()); // Prevent HTTP Parameter Pollution

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [`http://localhost:${process.env.APP_PORT}`];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
});

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body Parser & Sanitization
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(sanitize); // Custom sanitization middleware

// Health check endpoint (no API key required)
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Ecommerce API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "success",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Apply API Key + Rate Limiting to all /api routes
app.use("/api", apiKeyAuth, limiter);

// Auth routes dengan rate limiting khusus
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Routes
app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/products", ProductRoute);
app.use("/api/cart", CartRoute);
app.use("/api/categories", CategoryRoute);
app.use("/api/reviews", ReviewRoute);
app.use("/api/coupons", CouponRoute);
app.use("/api/orders", OrderRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Global Error Handler
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  if (global.server) {
    global.server.close(() => {
      console.log("HTTP server closed");
      sequelize.close().then(() => {
        console.log("Database connection closed");
        process.exit(0);
      });
    });
  }
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await dbConnection();

    await sequelize.sync({
      alter: process.env.NODE_ENV === "development",
      force: false,
    });
    console.log("All models synced with DB.");

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Security: Enabled`);
    });

    global.server = server;
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
})();