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

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL, // https://alaarajab.github.io/smilecare_frontend
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin (curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// handle preflight
app.options("*", cors());

app.use(express.json());

app.use(requestLogger);
app.use((req, res, next) => {
  if (req.path === "/api/login" && req.method === "POST") {
    console.log("CONTENT-TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);
  }
  next();
});
app.get("/health", (req, res) => {
  res.status(200).send({ ok: true });
});
// If you want /api prefix, change to: app.use("/api", mainRouter);
app.use("/api", mainRouter);

// 404 for unknown routes (ONLY here)
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/smilecaredb")
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
