const Contact = require("../models/contact");
const nodemailer = require("nodemailer");
const {
  CREATED_STATUS_CODE,
  OK_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require("../utils/constants");
const { BadRequestError } = require("../utils/errors");

// Create a new contact submission
const createContact = async (req, res, next) => {
  const {
    name,
    email,
    phone,
    bookAppointment,
    preferredDate,
    preferredTime,
    message,
  } = req.body;

  try {
    // Save contact to MongoDB
    const newContact = new Contact({
      name,
      email,
      phone,
      bookAppointment,
      preferredDate,
      preferredTime,
      message,
    });
    await newContact.save();

    // Send email to clinic owner
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailMessage = `
New contact form submission:

Name: ${name}
Email: ${email}
Phone: ${phone}
Book Appointment: ${bookAppointment ? "Yes" : "No"}
${
  bookAppointment
    ? `Preferred Date: ${preferredDate}\nPreferred Time: ${preferredTime}`
    : ""
}
${message ? `Message: ${message}` : ""}
`;

    await transporter.sendMail({
      from: `"SmileCare Website" <${process.env.EMAIL_USER}>`,
      to: process.env.CLINIC_EMAIL, // use env variable
      subject: "New Contact Form Submission",
      text: emailMessage,
    });

    res
      .status(CREATED_STATUS_CODE)
      .json({ message: "Contact submitted successfully" });
  } catch (error) {
    next(new BadRequestError(error.message)); // delegate to centralized error handler
  }
};

// Get all contacts
const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({});
    res.status(OK_STATUS_CODE).json(contacts);
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

module.exports = { createContact, getContacts };
