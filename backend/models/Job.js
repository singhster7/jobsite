const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const JobSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  recruiterName: String,
  applications: {
    type: Number,
    required: true,
  },
  positions: {
    type: Number,
    required: true,
  },
  applicants: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "jobs",
      },
      status: String,
      sop: String,
      rating: Number,
      dateOfJoining: String,
      dateOfApplication: Date,
    },
  ],
  dateOfPosting: {
    type: String,
    default: Date.now,
  },
  deadline: {
    type: String,
    default: Date.now,
  },
  skills: {
    type: [String],
    required: true,
  },
  typeOfJob: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  rating: Number,
});

module.exports = Job = mongoose.model("jobs", JobSchema);
