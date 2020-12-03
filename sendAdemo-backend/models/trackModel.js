const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  trackTitle: { type: String, required: true },
  trackPath: { type: String, required: true },
  trackAuthor: { type: String, required: true },
  trackStart: { type: Number, required: false },
  trackLength: { type: Number, required: false },
});

module.exports = Track = mongoose.model("track", trackSchema);
