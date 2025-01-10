const express = require("express");
const router = express.Router();

const Student = require("../models/student.model.js");

// POST /api/students/
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
    next(error)
  }
});

// GET /api/students/
router.get("/", (req, res) => {
  Student.find()
    .populate("cohort")
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((error) => {
      next(error)
    });
});

// GET /api/students/:cohortId
router.get("/:cohortId", async (req, res) => {
  try {
    const students = await Student.find({
      cohort: req.params.cohortId,
    }).populate("cohort");
    res.status(200).json(students);
  } catch (error) {
    next(error)
  }
});

// GET /api/students/:studentsId
router.get("/:studentsId", async (req, res) => {
  try {
    const student = await Student.find({ _id: req.params.studentsId }).populate(
      "cohort"
    );
    res.status(200).json(student);
  } catch (error) {
    next(error)
  }
});

// PUT /api/students/:studentsId
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
    next(error)
  }
});

// DELETE /api/students/:studentsId
router.delete("/:studentId", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.studentId);
    res.status(204).send();
  } catch (error) {
    next(error)
  }
});

module.exports = router;
