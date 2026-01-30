require("dotenv").config();
const mongoose = require("mongoose");
const DentalTip = require("./models/dental-tip");
const tipsJson = require("./data/db.json");

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/smilecaredb";

async function seed() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected:", mongoose.connection.name);

  // Clear old tips (optional but recommended while developing)
  await DentalTip.deleteMany({});

  const docs = tipsJson.dentalTips.map((t) => ({
    slug: t.id,
    title: t.title,
    description: t.description,
    nutrition: t.nutrition,
  }));

  await DentalTip.insertMany(docs);
  console.log(`✅ Inserted ${docs.length} dental tips`);

  await mongoose.disconnect();
  console.log("✅ Done");
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
