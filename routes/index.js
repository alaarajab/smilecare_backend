// routes/index.js
const express = require("express");
const router = express.Router();

const userRoutes = require("./users");
const contactRoutes = require("./contacts");

const { createUser, loginUser } = require("../controllers/users");
const {
  validateUserBody,
  validateLoginBody,
} = require("../middlewares/validation");

// -----------------------
// Public Auth routes
// -----------------------
router.post("/register", validateUserBody, createUser);
router.post("/login", validateLoginBody, loginUser);

// -----------------------
// Protected and other routes
// -----------------------
router.use("/users", userRoutes); // All /users routes are JWT-protected
router.use("/contacts", contactRoutes); // /contacts routes (GET protected, POST public)

// -----------------------
// 404 handler for unknown routes
// -----------------------
router.use((req, res, next) => {
  const { NOT_FOUND_STATUS_CODE } = require("../utils/constants");
  const { NotFoundError } = require("../utils/errors");
  next(
    new NotFoundError("Requested resource not found", NOT_FOUND_STATUS_CODE)
  );
});

module.exports = router;
