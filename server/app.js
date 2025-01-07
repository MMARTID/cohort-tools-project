require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PORT = process.env.PORT;

const app = express(); // inicializa express ;)

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const cors = require("cors");

// Conexión a la base de datos:
mongoose
.connect('mongodb://localhost:27017/cohort-tools-api')
.then(response => console.log(`Connected to Database: "${response.connections[0].name}"`))
.catch(error => console.error("Error connecting to MongoDB", error));

const cohortSchema = new Schema({
  "inProgress": Boolean,
  "cohortSlug": String,
  "cohortName": String,
  "format": String,
  "program": String,
  "campus": String,
  "startDate": Date,
  "endDate": Date,
  "programManager": String,
  "leadTeacher": String,
  "totalHours": Number,
});

const Cohort = mongoose.model("Cohort", cohortSchema);


const studentsSchema = new Schema({
  firstName : {
    type : String
  },
  lastName : {
    type : String
  },
  email : {
    type : String
  },
  phone : {
    type : String
  },
  linkedinUrl : {
    type : String
  },
  languages: [
    {
      name: { 
        type: String, 
         }, // Nombre del lenguaje
      proficiency: { 
        type: String }, // Nivel de competencia
    }
  ],
  program: {
    type : String
  },
  background: {
    type: String
  },
  image: {
    type: String
  },
  projects: [
   {
     cohort: {
      type : String
    },
     $oid: {
      type : String
    }
    }
  ]
});

/*
const userSchema = new Schema({
  email: {
    type: String
  },
  username: {
    type: String
  },
  avatarUrl: {
    type: String,
    default: "images/default-avatar.png"
  }
});

*/

const Students = mongoose.model("Students", studentsSchema);

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: ['http://localhost:5173'],
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));



// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (error) {
    res.status(500).json({ messange: "Error al devolver la data de Cohorts"});
  }
});

// app.get("/api/students", async (req, res) => {
//   try {
//     const students = await Students.find();
//     res.json(students);
//   } catch (error) {
//     res.status(500).json({ messange: "Error al devolver la data de Students"});
//   }
// });

app.get("/api/students", (req, res) => {
  Cohort.find()
  .then(students => {
    res.json(students);
  })
  .catch(error => {
    res.status(500).json({ message: "Error al devolver students"})
  })
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});