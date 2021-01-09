const { Schema, model } = require("mongoose");

const demoSchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  createdOn: { type: Date, required: true, default: Date.now },
  modifiedOn: { type: Date, required: true, default: Date.now },
  tracks: {
    type: [{ type: Schema.Types.ObjectId, ref: "track" }],
    default: []
  },
  contributors: {
    type: [{ type: Schema.Types.ObjectId, ref: "user" }],
    default: []
  },
});

module.exports = Demo = model("demo", demoSchema);