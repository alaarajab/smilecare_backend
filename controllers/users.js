const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { CREATED_STATUS_CODE, OK_STATUS_CODE } = require("../utils/constants");
const {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require("../utils/errors");

const { JWT_SECRET } = process.env;

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(OK_STATUS_CODE).json(users);
  } catch (error) {
    return next(new BadRequestError(error.message));
  }
};

// Get user by ID  (expects route: GET /users/:userId)
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");
    if (!user) throw new NotFoundError("User not found");

    return res.status(OK_STATUS_CODE).json(user);
  } catch (error) {
    return next(error);
  }
};

// Register a new user
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ConflictError("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      savedTips: [],
    });

    return res.status(CREATED_STATUS_CODE).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        savedTips: newUser.savedTips,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new UnauthorizedError("Invalid email or password");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedError("Invalid email or password");

    // ✅ Commit to req.user._id: store _id in token payload
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(OK_STATUS_CODE).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        savedTips: user.savedTips || [],
      },
    });
  } catch (error) {
    return next(error);
  }
};

// Get current user (protected)  GET /users/me
const getMe = async (req, res, next) => {
  try {
    // ✅ auth middleware must set req.user._id from token
    const user = await User.findById(req.user._id).select("-password");
    if (!user) throw new NotFoundError("User not found");

    return res.status(OK_STATUS_CODE).json(user);
  } catch (error) {
    return next(error);
  }
};

// Toggle saved tip (protected)  PATCH /users/me/saved-tips/:tipId
const toggleSavedTip = async (req, res, next) => {
  try {
    const { tipId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) throw new NotFoundError("User not found");
    console.log("TIP:", tipId);
    console.log("BEFORE:", user.savedTips);

    const saved = user.savedTips || [];
    const alreadySaved = saved.includes(tipId);

    user.savedTips = alreadySaved
      ? saved.filter((id) => id !== tipId)
      : [...saved, tipId];

    await user.save();
    console.log("AFTER:", user.savedTips);

    return res.status(OK_STATUS_CODE).json({ savedTips: user.savedTips });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  getMe,
  toggleSavedTip,
};
