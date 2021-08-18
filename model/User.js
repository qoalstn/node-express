const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 20,
  },
  pass: {
    type: String,
    required: true,
    max: 100,
  },
  content: {
    type: String,
    max: 100,
  },
  acs_token: {
    type: String,
    max: 100,
  },
  rfrsh_token: {
    type: String,
    max: 100,
  },
  scope: {
    type: String,
    max: 100,
  },
  acs_exp: {
    type: Date,
  },
  rfrsh_exp: {
    type: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
