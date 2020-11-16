const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  trackTitle: { type: String, required: true, unique: true },
  trackPath: { type: String, required: true },
  trackAuthor: { type: String, required: true },
});

module.exports = Track = mongoose.model("track", trackSchema);
