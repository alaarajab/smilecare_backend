const DentalTip = require("../models/dental-tip");

const getTips = async (req, res, next) => {
  try {
    const tips = await DentalTip.find({}).sort({ title: 1 });

    // Return in the SAME format your frontend expects (id/title/description/nutrition)
    const formatted = tips.map((t) => ({
      id: t.slug,
      title: t.title,
      description: t.description,
      nutrition: t.nutrition,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTips };
