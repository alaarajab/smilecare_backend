const INTERNAL_SERVER_ERROR_STATUS_CODE = require("../utils/constants");

function errorHandler(err, req, res, next) {
  console.error(err); // log for debugging

  // If the error already contains a status code → use it
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR_STATUS_CODE;

  // Default message if none exists
  const message = err.message || "An unexpected error occurred on the server.";

  res.status(statusCode).send({ message });
}

module.exports = errorHandler;
