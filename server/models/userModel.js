const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { 
    type: String,
    trim: true, // remove front and back whitespace if it exists
    required: "Email Address is required",
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 }
    }
  },
  password: { type: String, required: true, minlength: 5 },
  userName: { 
    type: String, 
    required: true,
    match: [ /^[a-zA-Z0-9_]{0,15}$/, "Invalid Username" ],
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
