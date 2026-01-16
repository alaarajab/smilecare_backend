const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [30, "Name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // exclude password from query results by default
  },
  savedCards: { type: [String], default: [] }, // references IDs of DentalTips or NutritionTips
});

module.exports = mongoose.model("user", userSchema);
