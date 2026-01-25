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
    res.status(OK_STATUS_CODE).json(users);
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) throw new NotFoundError("User not found");

    res.status(OK_STATUS_CODE).json(user);
  } catch (error) {
    next(error);
  }
};

// Register a new user
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ConflictError("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(CREATED_STATUS_CODE).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
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

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(OK_STATUS_CODE).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
const getMe = async (req, res, next) => {
  try {
    // req.user is set by auth middleware (JWT verified)
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) throw new NotFoundError("User not found");

    res.status(OK_STATUS_CODE).json(user);
  } catch (error) {
    next(error);
  }
};
const toggleSavedTip = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { tipId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.savedCards.includes(tipId)) {
      user.savedCards = user.savedCards.filter((id) => id !== tipId);
    } else {
      user.savedCards.push(tipId);
    }

    await user.save();
    res.status(200).json({ savedCards: user.savedCards });
  } catch (error) {
    next(error);
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
