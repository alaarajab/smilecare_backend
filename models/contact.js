const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema(
  {
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
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /^\+?[1-9]\d{1,14}$/.test(value),
        message: "Invalid phone number format",
      },
    },
    bookAppointment: { type: Boolean, default: false },
    preferredDate: { type: String }, // optional
    preferredTime: { type: String }, // optional
    message: {
      type: String,
      maxlength: [500, "Message cannot exceed 500 characters"],
      validate: {
        validator: (value) => !value || value.trim().length > 0,
        message: "Message cannot be empty if provided",
      },
    },
  },
  { timestamps: true } // ✅ Correct place for timestamps
);

module.exports = mongoose.model("Contact", contactSchema);
