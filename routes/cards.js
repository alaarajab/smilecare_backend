const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Save card (requires auth)
router.post("/save", auth, async (req, res) => {
  try {
    const { cardId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.savedCards.includes(cardId)) {
      user.savedCards.push(cardId);
      await user.save();
    }

    res.json({ savedCards: user.savedCards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contact form
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // TODO: Send email to clinic or store in DB
    console.log("Contact form submitted:", { name, email, message });

    res.json({ message: "Contact form submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
