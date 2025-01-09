function errorHandling(app) {

    // Gestores de Errores
    app.use((req, res) => {
        res.status(404).json({ errorMessage: `Esta ruta no existe`})
    })

    
    app.use((error, req, res, next) =>{
        // express entiende que esto es un gestor de error 500 porque tiene 4 argumentos
        console.log(error)
        res.status(500).json({ errorMessage:"Problemas de servidor"})

    
    })
}
module.exports = errorHandling;