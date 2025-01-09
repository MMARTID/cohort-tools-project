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
  cohort: {
    // metodo de mongoose para especificar ObjectId como tipo de dato, y soportas
    type: Schema.Types.ObjectId,
    // referencia al nombre de la variable del modelo Cohort (ver en cohort.model.js, deberia de ser el nombre de la variable que se exporta)
    ref: "Cohort", 
  },
  
  projects: [{
   /* 
    PROJECTS TENDRIA QUE SER UNA SUBCOLECCION DE STUDENTS
    CON LAS RUTAS:
    /api/students/:studentId/projects
    /api/students/:studentId/projects/:projectId
   */
    someContent: String
  }],

});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
