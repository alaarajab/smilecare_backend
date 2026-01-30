const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // ✅ Commit to req.user._id
    // Supports BOTH new tokens ({ _id }) and old tokens ({ userId })
    const id = payload._id || payload.userId;

    if (!id) {
      return next(new UnauthorizedError("Invalid token payload"));
    }

    req.user = { _id: id };
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};
