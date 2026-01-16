const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth"); // JWT verification
const { getUsers, getUserById } = require("../controllers/users");

// All routes below require authentication
router.use(auth);

// GET /users → fetch all users
router.get("/", getUsers);

// GET /users/:userId → fetch specific user
router.get("/:userId", getUserById);

module.exports = router;
