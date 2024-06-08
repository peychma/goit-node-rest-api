const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  avatarURL: {
    type: String,
    require: true,
  },
  token: {
    type: String,
    default: null,
  },
    verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
}, { versionKey: false, timestamps: true });


const User = model("user", userSchema);

module.exports = User;
