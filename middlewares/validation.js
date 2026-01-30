// middleware/validation.js
const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");

// -----------------------
// Celebrate options
// -----------------------
const celebrateOptions = {
  abortEarly: false,
  stripUnknown: true,
};

// -----------------------
// Custom URL validator
// -----------------------
const validateURL = (value, helpers) => {
  if (validator.isURL(value, { require_protocol: true })) return value;
  return helpers.error("string.uri");
};

// Reusable ObjectId validator
const objectId = Joi.string().hex().length(24).required().messages({
  "string.hex": "ID must be a valid hexadecimal",
  "string.length": "ID must be 24 characters",
  "any.required": "ID is required",
});

// -----------------------
// User Registration Validation
// POST /register
// -----------------------
const validateUserBody = celebrate(
  {
    [Segments.BODY]: Joi.object({
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
  },
  celebrateOptions,
);

// -----------------------
// Login Validation
// POST /login
// -----------------------
const validateLoginBody = celebrate(
  {
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Invalid email format",
        "any.required": "Email is required",
      }),
      password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
      }),
    }),
  },
  celebrateOptions,
);

// -----------------------
// Contact Form Validation
// POST /contacts
// -----------------------
const validateContactBody = celebrate(
  {
    [Segments.BODY]: Joi.object({
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
        .pattern(/^(\+1)?\d{10}$|^\+?[1-9]\d{1,14}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Phone must be 10 digits (US) or in international format like +16827161917",
          "any.required": "Phone is required",
        }),

      bookAppointment: Joi.boolean().default(false),

      preferredDate: Joi.when("bookAppointment", {
        is: true,
        then: Joi.string().required().messages({
          "any.required":
            "Preferred date is required when booking an appointment",
        }),
        otherwise: Joi.string().optional(),
      }),

      preferredTime: Joi.when("bookAppointment", {
        is: true,
        then: Joi.string().required().messages({
          "any.required":
            "Preferred time is required when booking an appointment",
        }),
        otherwise: Joi.string().optional(),
      }),

      message: Joi.string().max(500).allow("").optional(),
    }),
  },
  celebrateOptions,
);

// -----------------------
// Params validation
// -----------------------

// For routes like GET /users/:userId
const validateUserId = celebrate(
  {
    [Segments.PARAMS]: Joi.object({
      userId: objectId.messages({
        "string.hex": "User ID must be a valid hexadecimal",
        "string.length": "User ID must be 24 characters",
        "any.required": "User ID is required",
      }),
    }),
  },
  celebrateOptions,
);

// For routes like /something/:id
const validateId = celebrate(
  {
    [Segments.PARAMS]: Joi.object({
      id: objectId,
    }),
  },
  celebrateOptions,
);

// For routes like PATCH /users/me/saved-tips/:tipId
// tipId is NOT a Mongo ObjectId in your app (it's like "dry-mouth")
const validateTipId = celebrate(
  {
    [Segments.PARAMS]: Joi.object({
      tipId: Joi.string().min(1).max(100).required().messages({
        "string.empty": "Tip ID is required",
        "any.required": "Tip ID is required",
      }),
    }),
  },
  celebrateOptions,
);

module.exports = {
  validateURL,
  validateUserBody,
  validateLoginBody,
  validateContactBody,
  validateId,
  validateUserId,
  validateTipId,
};
