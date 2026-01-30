const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const {
  getUsers,
  getUserById,
  getMe,
  toggleSavedTip,
} = require("../controllers/users");

// All routes below require auth
router.use(auth);

router.get("/", getUsers);
router.get("/me", getMe); // IMPORTANT: keep /me before /:userId
router.get("/:user._id", getUserById);

// no need to add auth again (router.use(auth) already did)
router.patch("/me/saved-tips/:tipId", toggleSavedTip);

module.exports = router;
