const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cohortSchema = new Schema({
  inProgress: Boolean,
  cohortSlug: {
    type: String,
    required: true,
    unique: true,
  },
  cohortName: String,
  format: String,
  program: String,
  campus: String,
  startDate: Date,
  endDate: Date,
  programManager: String,
  leadTeacher: String,
  totalHours: Number,
});

const Cohort = mongoose.model("Cohort", cohortSchema)

module.exports = Cohort
