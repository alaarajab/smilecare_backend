const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports = function auth(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
