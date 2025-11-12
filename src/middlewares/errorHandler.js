/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = "Resource already exists";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  } else {
    console.error("Error:", {
      message: err.message,
      statusCode,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }

  const response = {
    status: "error",
    message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(statusCode).json(response);
};

/**
 * Catch Async Errors
 * Wrapper untuk async route handlers
 *
 * Usage:
 * router.get('/path', catchAsync(async (req, res) => {
 *
 * }));
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom Error Class
 * For making operational errors
 *
 * Usage:
 * throw new AppError('User not found', 404);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  catchAsync,
  AppError,
};
