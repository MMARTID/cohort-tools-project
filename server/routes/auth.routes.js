const router = require("express").Router();

const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")

// POST /auth/signup => Creates a new user in the database
router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  // 0. que la data exista
  if (!name || !email || !password) {
    res.status(400).json({
      errorMessage:
        "Nombre de usuario, Correo Electronico y Contraseña son campos obligatorios",
    });
    return; // detiene la ejecución de la ruta
  }

  // 1. username minimo 2 caracteres
  if (name.length < 2) {
    res.status(400).json({
      errorMessage:
        "El nombre de usuario tiene que tener dos caracteres como minimo",
    });
    return; // detiene la ejecución de la ruta
  }

  // 2. contraseña con nivel de seguridad
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (regexPassword.test(password) === false) {
    res.status(400).json({ errorMessage: "la contraseña no es valida" });
    return;
  }

  // 3. Correo electronico con formato correcto
  const regexEmail =
    /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/gm;
  if (regexEmail.test(email) === false) {
    res.status(400).json({ errorMessage: "El formato el email no es valido" });

    return;
  }

  try {
    const HashedPassword = await bcryptjs.hash(password, 12);

    // VALOR EMAIL en INPUT VS VALOR EMAIL en DB
    const findUser = await User.findOne({ email: email });
    // console.log(findUser)
    // SI EXISTE UN USUARIO CON EL EMAIL DESDE EL QUE QUIEREN REGISTRARSE:
    if (findUser !== null) {
      res.status(400).json({
        errorMessage: "Ya existe un usuario con ese correo electronico",
      });
      return; // detiene la ejecución de la ruta
    }
    await User.create({
      name: name,
      email: email,
      password: HashedPassword,
    });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

// POST /auth/login => Checks the sent email and password and, if email and password are correct returns a JWT
//1.- LLAMADA CUANDO ALGUIEN RELLENA LOS INPUTS DEL LOGIN (REQ DE CLIENT A SERVER)
//2.- SE DESESTRUCRA EL REQ.BODY PARA ABREVIAR
//3.- TIENE QUE HABER UN EMAIL Y UNA CONTRASEÑA (NO PUEDES REGISTRARTE SIN PONER EL CONTRSAEÑA / TAMPOCO SIN PONER EL EMAIL)
//4._
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // tiene que haber data en email y en password. Si el usuario no rellena alguno de los campos, se activa una clausula de guardia
  if (!email || !password) {
    res.status(400).json({
      errorMessage: "correo electronico y contraseña son campos obligatorios",
    });
    return; // detiene la ejecución de la ruta
  }

  try {

    // el usuario debe existir en la DB
    const findUser = await User.findOne({ email: email });
    console.log(findUser);
    if (findUser === null) {
      res.status(400).json({errorMessage: "usuario no encontrado con ese correo electronico",});
    }

    // la contraseña debe ser correcta
    const isPasswordCorrect = await bcryptjs.compare(password, findUser.password)
    if (isPasswordCorrect === false) {
       res.status(400).json({errorMessage: "contraseña incorrecta"}) 
       return // detiene la ejecución de la ruta
    }

    //YA HEMOS AUTENTICADO AL USUARIO 🎉 | Le vamos a entregar su llave virtual

    const payload = {
        _id: findUser._id,
        email: findUser.email
    } // el payload es toda información estatica y unica que identifica al usuario

    const tokenConfig = {
        algorithm: "HS256",
        expiresIn: "7d"
    }

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, tokenConfig)

    res.status(202).json({authToken: authToken})


  } catch (error) {
    next(error);
  }
});

// GET /auth/verify => Verifies that the JWT sent by the client is valid

module.exports = router;

/* 

1. ruta post signup y crear usuario //* DONE
2. validaciones de ruta signup //* DONE
3. cifrado contraseña //* DONE
4. ruta de login y probar //* DONE
5. validaciones de login //* DONE
6. creacion y envio del token //* DONE
7. ruta privada
8. middleware validacion del token
9. ponen el middleware en rutas privadas
10. ruta verify

*/
