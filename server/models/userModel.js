const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  userName: { 
    type: String, 
    required: true,
    validate: [ /^[a-zA-Z0-9_]{0,15}$/, "Invalid Username" ],
    maxlength: 15,
    // https://stackoverflow.com/questions/13991604/mongoose-schema-validating-unique-field-case-insensitive
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 }
    }
  },
  displayName: { type: String, required: true },
  followers: {
    type: [{ type: Schema.Types.ObjectId, ref: "user" }],
    default: []
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: "user" }],
    default: []
  },
});

User = model("user", userSchema);

module.exports = User;
