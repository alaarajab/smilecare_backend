require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

async function resetSavedTips() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.updateMany({}, { $set: { savedTips: [] } });
  console.log("✅ Cleared savedTips for all users");
  await mongoose.disconnect();
}

resetSavedTips();
