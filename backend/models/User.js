const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  role: {
    type: String,
    enum: ['applicants', 'recruiters'],
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userId: {
    type: String, 
    required: true
  }
});

module.exports = User = mongoose.model("users", UserSchema);