const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  linkedinUrl: {
    type: String,
  },
  languages: { 
    type: [String],
  },
  program: {
    type: String,
  },
  background: {
    type: String,
  },
  image: {
    type: String,
  },
  projects: {
    type: [String]
  },
  cohort: {
    type: String
  }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
