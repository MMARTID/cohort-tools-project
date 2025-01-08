require('dotenv').config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT;

const app = express(); // inicializa express ;)

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const Cohort = require("./models/cohort.model.js")
const Student = require("./models/student.model.js")

// Conexión a la base de datos:
mongoose
.connect('mongodb://127.0.0.1:27017/cohort-tools-api')
.then(response => console.log(`Connected to Database: "${response.connections[0].name}"`))
.catch(error => console.log("Error connecting to MongoDB", error));


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

//! COHORTS ROUTES //

app.post("/api/cohorts", async (req, res) => {
  try {
    
    const createdCohort = await Cohort.create({
      cohortSlug: req.body.cohortSlug,
      cohortName: req.body.cohortName,
      program: req.body.program,
      format: req.body.format,
      campus: req.body.campus,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      inProgress: req.body.inProgress,
      programManager: req.body.programManager,
      leadTeacher: req.body.leadTeacher,
      totalHours: req.body.totalHours
    })

    res.status(201).json(createdCohort)
    
  } catch (error) {
    res.status(500).json(`Error al acceder a cohorts, error: ${error}`)
  }
})

app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json({ message: "Error al devolver la data de Cohorts"});
  }
});

app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const cohorts = await Cohort.findById(req.params.cohortId);
    res.status(200).json(cohorts)
  } catch (error) {
    res.status(500).json({ message: "Error al devolver la data de Cohorts"});
  }
});

app.put("/api/cohorts/:cohortId", async (req, res) => {
  try {
    
    await Cohort.findByIdAndUpdate(req.params.cohortId, {
      cohortSlug: req.body.cohortSlug,
      cohortName: req.body.cohortName,
      program: req.body.program,
      format: req.body.format,
      campus: req.body.campus,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      inProgress: req.body.inProgress,
      programManager: req.body.programManager,
      leadTeacher: req.body.leadTeacher,
      totalHours: req.body.totalHours
    })

    res.status(200).json("Documento Editado")

  } catch (error) {
    res.status(500).json(`Error al hacer update de un Cohort especifico, error: ${error}`)
  }
})

app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    
    await Cohort.findByIdAndDelete(req.params.cohortId)
    res.status(204).send();

  } catch (error) {
    res.status(500).json({ message: `Error a la hora de eliminar el cohort, error: ${error}`})
  }
})

//! STUDENTS ROUTES //

app.post("/api/students", async(req, res) => {
  try {
    const createStudents = await Student.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      linkedinUrl: req.body.linkedinUrl,
      languages: req.body.languages,
      program: req.body.program,
      background: req.body.background,
      image: req.body.image,
      cohort: req.body.cohort,
      projects: req.body.projects,
    })

    res.status(201).json(createStudents)
  } catch (error) {
    console.log(error) 
    res.status(500).json({message: "Error al devover students"} )
  }
})


app.get("/api/students", (req, res) => {
  Student.find().populate("cohort")
  .then(students => {
    res.status(200).json(students);
  })
  .catch(error => {
    res.status(500).json({ message: "Error al devolver students"})
  })
})

app.get("/api/students/cohort/:cohortId", async(req, res) => {
try {
  const students = await Student.find( {cohort : req.params.cohortId} ).populate("cohort")
  res.status(200).json(students)
} catch (error) {
  console.log(req.params.cohortId)
  res.status(500).json(`Error en conseguir el alumno especifico, error: ${error}`)
}

})

app.get("/api/students/:studentsId", async(req, res) => {
  try {
    
    const student = await Student.find({ _id : req.params.studentsId}).populate("cohort")
    res.status(200).json(student)

  } catch (error) {
    res.status(500).json(`Error en conseguir el alumno especifico, error: ${error}`)
  }
})








app.put("/api/students/:studentsId", async(req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.studentId, {

    
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      linkedinUrl: req.body.linkedinUrl,
      languages: req.body.languages,
      program: req.body.program,
      background: req.body.background,
      image: req.body.image,
      cohort: req.body.cohort,
      projects: req.body.projects
    })

    res.status(200).json("documento editado")
  } catch (error) {
    res.status(500).json(`Error al hacer update de un Cohort especifico, error: ${error}`)
  } 
})

app.delete("/api/students/:studentId", async(req, res) => {

  try {
    
    await Student.findByIdAndDelete(req.params.studentId)
    res.status(204).send();

  } catch (error) {
    res.status(500).json({ message: `Error a la hora de eliminar el cohort, error: ${error}`})
  }
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});