const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middlewares.js") // importamos middleware para verificar Token


router.get("/", (req, res ) => {
res.status(200).json({message: "server runing"});
});


const cohortRouter = require("./cohort.routes.js")
router.use("/cohorts", cohortRouter)

const studentRouter = require("./students.routes.js")
router.use("/students", studentRouter)

const authRouter = require("./auth.routes.js")
router.use("/auth", authRouter)



// User Routes
// GET /api/users/:id
// Retrivies a specific user by id. The route should be protected by the authentication middleware
router.get("/users/:id", verifyToken, (req, res) => {

    res.status(200).json(req.payload)

})

module.exports = router
