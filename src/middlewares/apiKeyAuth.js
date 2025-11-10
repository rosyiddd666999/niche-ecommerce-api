const crypto = require("crypto");

const VALID_API_KEYS = new Set(
  [
    process.env.API_KEY_MOBILE_APP,
    process.env.API_KEY_WEB_APP,
    process.env.API_KEY_ADMIN_PANEL,
  ].filter(Boolean)
);

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      status: "error",
      message: "API key is required",
    });
  }

  if (!VALID_API_KEYS.has(apiKey)) {
    console.warn(`Invalid API key attempt from IP: ${req.ip}`);

    return res.status(403).json({
      status: "error",
      message: "Invalid API key",
    });
  }

  next();
};

module.exports = {
  apiKeyAuth,
};
