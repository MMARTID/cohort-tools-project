const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {

  try {

    console.log("ejecutando el middleware");
    const token = req.headers.authorization.split(" ")[1]

    const payload = jwt.verify(token, process.env.TOKEN_SECRET)
    //*    | si comprueba que el token es valido, continua con el next()
    //!    | si commprueba que el token NO es valido, se mueve al catch()
    //todo | si el Token es valido, nos devuelve la información de ese usuario
    //                                                    |
    // console.log(payload) | en nuestro caso seria:  _id y email

    req.payload = payload 
    // modifica el request (req) para que cuando entre en la proxima ruta:
        // se tenga accesso a la información almacenada en ese request

    next(); //continua con la ruta


  } catch (error) {
    res.status(401).json({errorMessage: "Token no valido o no existe"})
  }
}

module.exports = {
  verifyToken,
};
