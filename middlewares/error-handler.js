// middlewares/error-handler.js
const { isCelebrateError } = require("celebrate");
const { INTERNAL_SERVER_ERROR_STATUS_CODE } = require("../utils/constants");

function errorHandler(err, req, res, next) {
  // ✅ Show Celebrate validation details
  if (isCelebrateError(err)) {
    const details = [];

    for (const [, joiError] of err.details) {
      details.push(...joiError.details.map((d) => d.message));
    }

    console.log("[CELEBRATE]", req.method, req.originalUrl, details);

    return res.status(400).json({
      message: "Validation failed",
      details,
    });
  }

  console.error(err);

  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR_STATUS_CODE;
  const message = err.message || "An unexpected error occurred on the server.";

  return res.status(statusCode).json({ message });
}

module.exports = errorHandler;
