const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
require("dotenv").config();
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { NotFoundError } = require("./utils/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const port = process.env.PORT || 3001;

// Simple logger function (replaces console.log/error for ESLint)
const log = {
  info: (msg) => process.stdout.write(`INFO: ${msg}\n`),
  error: (err) => process.stderr.write(`ERROR: ${err}\n`),
};

// Middleware
app.use(cors());
app.use(express.json());

// Enable request logger BEFORE all routes
app.use(requestLogger);

// Mount main routes
app.use("/", mainRouter);

// Catch-all route for unknown endpoints
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// Enable error logger AFTER routes
app.use(errorLogger);

// Celebrate error handler (MUST be before centralized handler)
app.use(errors());

// Centralized error handler (must be last)
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/smilecaredb")
  .then(() => log.info("Connected to MongoDB"))
  .catch(log.error);

// Start server
app.listen(port, () => {
  log.info(`Server listening on port ${port}`);
});
