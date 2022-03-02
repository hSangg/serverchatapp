const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPicture: {
    type: String,
    default: "",
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  desc: {
    type: String,
  },
  city: {
    type: String,
  },
  from: {
    type: String,
  },
  relationship: {
    type: Number,
    enum: [1, 2, 3],
  },
});

module.exports = mongoose.model("User", UserSchema);
