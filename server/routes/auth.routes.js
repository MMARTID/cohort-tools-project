const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewares/auth.middlewares"); // importamos el middleware VerifyToken, para verificar los Tokens



/* ***    POST /auth/signup => Creates a new user in the database    *** */
router.post("/signup", async (req, res, next) => {

  const { name, email, password } = req.body;

  // COMPROBAMOS QUE LA DATA EXISTE (clausula de guardia)
  if (!name || !email || !password) {
    res.status(400).json({
      errorMessage:
        "Nombre de usuario, Correo Electronico y Contraseña son campos obligatorios",
    });
    return; // detiene la ejecución de la ruta
  }


  // COMPROBAMOS QUE EL "NAME" TIENE MINIMO 2 CARACTERES (clausula de guardia)
  if (name.length < 2) {
    res.status(400).json({
      errorMessage:
        "El nombre de usuario tiene que tener dos caracteres como minimo",
    });
    return; // detiene la ejecución de la ruta
  }


  // COMPROBAMOS QUE LA CONTRASEÑA CUMPLE CON EL NIVEL DE SEGURIDAD MINIMO (clausula de guardia)
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (regexPassword.test(password) === false) {
    res.status(400).json({ errorMessage: "la contraseña no es valida" });
    return;
  }

  // COMPROBAMOS QUE EL CORREO ELECTRONICO CUMPLE CON EL FORMATO ADECUADO (clausula de guardia)
  const regexEmail =
    /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/gm;
  if (regexEmail.test(email) === false) {
    res.status(400).json({ errorMessage: "El formato el email no es valido" });

    return;
  }

  try {
    // CIFRAMOS LA CONTRASEÑA
    const HashedPassword = await bcryptjs.hash(password, 12);

    // ENCONTRAMOS AL USUARIO POR SU EMAIL
    const findUser = await User.findOne({ email: email });

    // COMPROBAMOS SI EXISTE O NO UN USUARIO CON ESE EMAIL (clausula de guardia)
    if (findUser !== null) {
      res.status(400).json({
        errorMessage: "Ya existe un usuario con ese correo electronico",
      });
      return; // detiene la ejecución de la ruta
    }

    // CREAMOS EL USUARIO 
    await User.create({
      name: name,
      email: email,
      password: HashedPassword,
    });

    // RESPUESTA
    res.sendStatus(201);

    //ERROR HANDLING
  } catch (error) {
    next(error);
  }
});



/* ***    POST /auth/login => Verifica el email y la contraseñas enviados. Si el email y la contraseña son correctos, devuelve un JWT    *** */
router.post("/login", async (req, res, next) => {

  // DESCONSTRUIMOS DE LA INFORMACIÓN ENVIADA: email Y password
  const { email, password } = req.body;

  // VERIFICAMOS SI LA DATA email Y password EXISTEN. | (clausula de guardia)
  if (!email || !password) {
    res.status(400).json({
      errorMessage: "correo electronico y contraseña son campos obligatorios",
    });
    return; // detiene la ejecución de la ruta
  }

  try {

    // ENCONTRAMOS AL USUARIO MEDIANTE LA DATA email
    const findUser = await User.findOne({ email: email });

    // VERIFICAMOS SI EL USUARIO CON ESE EMAIL EXISTE EN LA BASE DE DATOS (clausula de guardia)
    if (findUser === null) {
      res.status(400).json({errorMessage: "usuario no encontrado con ese correo electronico",});
    }

    // COMPARAMOS LA CONTRASEÑA ENVIADA (a la hora de hacer login) CON LA CONTRASEÑA DEL USUARIO ENCONTRADO (findUser) EN LA BASE DE DATOS
    const isPasswordCorrect = await bcryptjs.compare(password, findUser.password)

    // VERIFICAMOS QUE LA CONTRASEÑA ES CORRECTA (clausula de guardia)
    if (isPasswordCorrect === false) {
       res.status(400).json({errorMessage: "contraseña incorrecta"}) 
       return // detiene la ejecución de la ruta
    }


    //HASTA AQUI YA HEMOS AUTENTICADO AL USUARIO 🎉 | AHORA LE VAMOS A ENTREGAR SU LLAVE VIRTUAL


    // ENCONTRAMOS TODA LA INFORMACIÓN ESTATICA Y UNICA QUE IDENTIFICA AL USUARIO MEDIANTE (payload)
    const payload = {
        _id: findUser._id,
        email: findUser.email
    } // el payload es toda información estatica y unica que identifica al usuario
 

    // CONFIGURAMOS EL TOKEN
    const tokenConfig = {
        algorithm: "HS256", //tipo de algoritmo utilizado
        expiresIn: "7d" //tiempo de expiración del token
    }

    // CREAMOS EL TOKEN
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, tokenConfig)

    // ENTREGAMOS EL TOKEN
    res.status(202).json({authToken: authToken})


    // ERROR HANDLING
  } catch (error) {
    next(error);
  }
});


/* ***    GET /auth/verify => Verifica que el JWT enviado por el cliente es valido   *** */
router.get("/verify", verifyToken, (req, res, next) => {

    // ESTA RUTA SOLO SE UTILIZA PARA VERIFICAR EL TOKEN UNA VEZ CUANDO EL USUARIO ESTÁ NAVEGANDO POR PRIMERA VEZ POR LA WEB.
    // SE USA PARA INDICAR AL FRONT-END QUE EL USUARIO ES VALIDO (verifyToken) Y QUIEN ES ESE USUARIO (payload)

    // ENTREGAMOS EL PAYLOAD
    res.status(202).json({ payload: req.payload })

})



module.exports = router;




/* 

PASO A PASO

1. ruta post signup y crear usuario //* DONE
2. validaciones de ruta signup //* DONE
3. cifrado contraseña //* DONE
4. ruta de login y probar //* DONE
5. validaciones de login //* DONE
6. creacion y envio del token //* DONE
7. ruta privada //* DONE
8. middleware validacion del token //* DONE
9. ponen el middleware en rutas privadas //* DONE
10. ruta verify //* DONE

*/

