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

// -----------------------------
// CORS
// -----------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://smilecare.jumpingcrab.com",
  "https://smilecare.jumpingcrab.com",
  "http://www.smilecare.jumpingcrab.com",
  "https://www.smilecare.jumpingcrab.com",
  process.env.FRONTEND_URL, // optional fallback (e.g., GitHub Pages)
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no Origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// IMPORTANT: preflight must use the SAME options
app.options("*", cors(corsOptions));

// -----------------------------
// Parsers
// -----------------------------
app.use(express.json());

// -----------------------------
// Logging
// -----------------------------
app.use(requestLogger);

// Optional debug (kept from your code)
app.use((req, res, next) => {
  if (req.path === "/api/login" && req.method === "POST") {
    console.log("CONTENT-TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);
  }
  next();
});

// -----------------------------
// Health
// -----------------------------
app.get("/health", (req, res) => {
  res.status(200).send({ ok: true });
});

// -----------------------------
// Routes
// -----------------------------
app.use("/api", mainRouter);

// -----------------------------
// 404 Handler (after routes only)
// -----------------------------
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// -----------------------------
// Error handling
// -----------------------------
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

// -----------------------------
// DB + Server start
// -----------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/smilecaredb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
