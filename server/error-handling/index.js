function errorHandling(app) {

    // Gestores de Errores
    app.use((req, res) => {
        res.status(404).json({ errorMessage: `Esta ruta no existe quillo`})
    })

    
    app.use((error, req, res, next) =>{
        console.log(error)
        res.status(500).json({errorMessage:"Problemas de servidor"})

    
    })
}
module.exports = errorHandling;