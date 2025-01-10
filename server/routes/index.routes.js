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


const { verifyToken } = require("../middlewares/auth.middlewares.js")

// EJEMPLO DE RUTA PRIVADA
router.get("/private-route-example", verifyToken, (req, res) => {

    // console.log(req.headers)

    //! EL BACKEND NECESITA SABER QUIEN ES EL USUARIO
    console.log(req.payload)

    res.send("envio de información privada")

})

module.exports = router
