const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { createContact, getContacts } = require("../controllers/contact");
const { validateContactBody } = require("../middlewares/validation");

// POST /contacts → anyone can submit a contact form
router.post("/", validateContactBody, createContact);

// GET /contacts → only authenticated users (clinic owner/admin)
router.get("/", auth, getContacts);

module.exports = router;
