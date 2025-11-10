/**
 * Sanitize middleware untuk mencegah XSS dan NoSQL injection
 */
const sanitize = (req, res, next) => {
  try {
    // Sanitize body
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query params
    if (req.query && typeof req.query === "object") {
      const sanitizedQuery = {};
      for (const key in req.query) {
        if (Object.prototype.hasOwnProperty.call(req.query, key)) {
          sanitizedQuery[key] = sanitizeValue(req.query[key]);
        }
      }
      // Ganti query dengan object baru (tidak modify langsung)
      Object.defineProperty(req, "sanitizedQuery", {
        value: sanitizedQuery,
        writable: false,
        configurable: false,
      });
    }

    // Sanitize params
    if (req.params && typeof req.params === "object") {
      const sanitizedParams = {};
      for (const key in req.params) {
        if (Object.prototype.hasOwnProperty.call(req.params, key)) {
          sanitizedParams[key] = sanitizeValue(req.params[key]);
        }
      }
      Object.defineProperty(req, "sanitizedParams", {
        value: sanitizedParams,
        writable: false,
        configurable: false,
      });
    }

    next();
  } catch (error) {
    console.error("Sanitization error:", error);
    next(error);
  }
};

/**
 * Sanitize object secara rekursif
 */
const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return sanitizeValue(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip keys yang mengandung karakter berbahaya (NoSQL injection)
      if (key.includes("$") || key.includes(".")) {
        console.warn(`Blocked potentially malicious key: ${key}`);
        continue;
      }

      sanitized[key] = sanitizeObject(obj[key]);
    }
  }

  return sanitized;
};

/**
 * Sanitize individual value (XSS prevention)
 */
const sanitizeValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  // Remove potentially dangerous characters/patterns
  return value
    .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove <script> tags
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, "") // Remove <iframe> tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers (onclick, onerror, etc)
    .replace(/<[^>]*>/g, "") // Remove all HTML tags
    .trim();
};

/**
 * Strict sanitization untuk input yang tidak boleh mengandung HTML sama sekali
 */
const sanitizeStrict = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(/[<>'"&]/g, (char) => {
      const entities = {
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#x27;",
        '"': "&quot;",
        "&": "&amp;",
      };
      return entities[char];
    })
    .trim();
};

module.exports = {
  sanitize,
  sanitizeStrict,
  sanitizeValue,
};