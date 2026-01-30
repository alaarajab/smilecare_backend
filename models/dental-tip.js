const mongoose = require("mongoose");

const dentalTipSchema = new mongoose.Schema(
  {
    // this replaces your JSON "id" like "toothache"
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    // in your JSON it's an array of strings
    nutrition: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("dental-tip", dentalTipSchema);
