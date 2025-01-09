const express = require("express");
const router = express.Router();

const Student = require("../models/student.model.js");

router.post("/", async (req, res) => {
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
    });

    res.status(201).json(createStudents);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al devover students" });
  }
});

router.get("/", (req, res) => {
  Student.find()
    .populate("cohort")
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error al devolver students" });
    });
});

router.get("/cohort/:cohortId", async (req, res) => {
  try {
    const students = await Student.find({
      cohort: req.params.cohortId,
    }).populate("cohort");
    res.status(200).json(students);
  } catch (error) {
    console.log(req.params.cohortId);
    res
      .status(500)
      .json(`Error en conseguir el alumno especifico, error: ${error}`);
  }
});

router.get("/:studentsId", async (req, res) => {
  try {
    const student = await Student.find({ _id: req.params.studentsId }).populate(
      "cohort"
    );
    res.status(200).json(student);
  } catch (error) {
    res
      .status(500)
      .json(`Error en conseguir el alumno especifico, error: ${error}`);
  }
});

router.put("/:studentsId", async (req, res) => {
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
      projects: req.body.projects,
    });

    res.status(200).json("documento editado");
  } catch (error) {
    res
      .status(500)
      .json(`Error al hacer update de un Cohort especifico, error: ${error}`);
  }
});

router.delete("/:studentId", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.studentId);
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error a la hora de eliminar el cohort, error: ${error}`,
      });
  }
});

module.exports = router;
