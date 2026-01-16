// Simple request & error logger

// Logs all incoming requests
const requestLogger = (req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
};

// Logs errors
const errorLogger = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);
  next(err);
};

module.exports = { requestLogger, errorLogger };
