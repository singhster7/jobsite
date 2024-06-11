const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const RecruiterSchema = new Schema({
  name: String,
  email: String,
  number: Number,
  bio: String,
  jobsCreated: [
    {
      type: Schema.Types.ObjectId,
      ref: "jobs",
    },
  ],
});
module.exports = Recruiter = mongoose.model("recruiters", RecruiterSchema);
