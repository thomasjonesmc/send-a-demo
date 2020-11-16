const mongoose = require("mongoose");

const demoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  demoTitle: { type: String, required: true },
  displayName: { type: String, required: true },
  demoPath: { type: String, required: true },
  createdOn: { type: Date, required: true },
  modifiedOn: { type: Date, required: true },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
});

module.exports = Demo = mongoose.model("demo", demoSchema);
