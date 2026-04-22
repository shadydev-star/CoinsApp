// src/middleware/validate.js
const { AppError } = require("../utils/AppError");

/**
 * Zod validation middleware factory.
 * Usage: validate(myZodSchema)
 */
exports.validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    return next(new AppError(message, 422));
  }
  req.body = result.data; // use coerced/validated data
  next();
};