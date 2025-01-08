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
  languages: [
    {
      name: {
        type: String,
      }, // Nombre del lenguaje
      proficiency: {
        type: String,
      }, // Nivel de competencia
    },
  ],
  program: {
    type: String,
  },
  background: {
    type: String,
  },
  image: {
    type: String,
  },
  projects: [
    {
      cohort: {
        type: String,
      },
      $oid: {
        type: String,
      },
    },
  ],
});

const Student = mongoose.model("Students", studentSchema);

module.exports = Student
