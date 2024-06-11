const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ApplicantSchema = new Schema({
  name: String,
  email: String,
  number: Number,
  education: [
    {
      institutionName: String,
      startYear: String,
      endYear: String,
    },
  ],
  jobsApplied: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "jobs",
      },
      status: String,
    },
  ],
  skills: [String],
  rating: Number,
  foundJob: String,
  imageName: String,
  resumeName: String,
});
module.exports = Applicant = mongoose.model("applicants", ApplicantSchema);
