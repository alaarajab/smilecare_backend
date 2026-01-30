const router = require("express").Router();
const { getTips } = require("../controllers/tips");

router.get("/", getTips); // GET /api/tips

module.exports = router;
