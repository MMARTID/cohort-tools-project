const express = require("express");
const router = express.Router();

const Cohort = require("../models/cohort.model.js");

// POST /api/cohorts
router.post("/", async (req, res) => {
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
      totalHours: req.body.totalHours,
    });

    res.status(201).json(createdCohort);

  } catch (error) {
    res.status(500).json(`Error al acceder a cohorts, error: ${error}`);
  }
});

// GET /api/cohorts
router.get("/", async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json({ message: "Error al devolver la data de Cohorts" });
  }
});

// GET /api/cohorts/:cohortId
router.get("/:cohortId", async (req, res) => {
  try {
    const cohorts = await Cohort.findById(req.params.cohortId);
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json({ message: "Error al devolver la data de Cohorts" });
  }
});

// PUT /api/cohorts/:cohortId
router.put("/:cohortId", async (req, res) => {
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
      totalHours: req.body.totalHours,
    });

    res.status(200).json("Documento Editado");
  } catch (error) {
    res
      .status(500)
      .json(`Error al hacer update de un Cohort especifico, error: ${error}`);
  }
});

// DELETE /api/cohorts/:cohortId
router.delete("/:cohortId", async (req, res) => {
  try {
    await Cohort.findByIdAndDelete(req.params.cohortId);
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
