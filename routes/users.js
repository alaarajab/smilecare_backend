const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth"); // JWT verification
const { getUsers, getUserById, getMe } = require("../controllers/users");
const { toggleSavedTip } = require("../controllers/users");

router.use(auth);
router.get("/", getUsers); // fetch all users
router.get("/me", getMe); // fetch logged-in user
router.get("/:userId", getUserById); // fetch any user by ID
router.patch("/me/saved-tips/:tipId", auth, toggleSavedTip);

module.exports = router;
