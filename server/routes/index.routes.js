const express = require("express");
const router = express.Router();

router.get("/", (req, res ) => {
res.status(200).json({message: "server runing"});
});

const cohortRouter = require("./cohort.routes.js")
router.use("/cohorts", cohortRouter)

const studentRouter = require("./students.routes.js")
router.use("/students", studentRouter)

const authRouter = require("./auth.routes.js")
router.use("/auth", authRouter)

module.exports = router
