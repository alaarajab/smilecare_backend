// middleware/validation.js
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

// Custom URL validator
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) return value;
  return helpers.error("string.uri");
};

// -----------------------
// User Registration Validation
// -----------------------
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 30 characters",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  }),
});

// -----------------------
// Login Validation
// -----------------------
const validateLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),
});

// -----------------------
// Contact Form Validation
// -----------------------
const validateContactBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 30 characters",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid phone number format",
        "any.required": "Phone is required",
      }),
    bookAppointment: Joi.boolean().optional(),
    preferredDate: Joi.string().optional(),
    preferredTime: Joi.string().optional(),
    message: Joi.string().max(500).optional(),
  }),
});

// -----------------------
// Validate MongoDB ObjectId
// -----------------------
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "ID must be a valid hexadecimal",
      "string.length": "ID must be 24 characters",
      "any.required": "ID is required",
    }),
  }),
});

module.exports = {
  validateUserBody,
  validateLoginBody,
  validateContactBody,
  validateId,
};
