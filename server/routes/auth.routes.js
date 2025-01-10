const router = require("express").Router();

const User = require("../models/User.model");

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
    // verificamos que el email sea unico
    const findUser = await User.findOne({ email: email });
    if (findUser !== null) {
      res.status(400).json({ errorMessage: "Este email ya existe" });
      return;
    }
    await User.create({
      name: name,
      email: email,
      password: password,
    });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});
// POST /auth/login => Checks the sent email and password and, if email and password are correct returns a JWT

// GET /auth/verify => Verifies that the JWT sent by the client is valid

module.exports = router;

/* 

1. ruta post signup y crear usuario //* DONE
2. validaciones de ruta signup //* DONE
3. cifrado contraseña
4. ruta de login y probar
5. validaciones de login
6. creacion y envio del token
7. ruta privada
8. middleware validacion del token
9. ponen el middleware en rutas privadas
10. ruta verify

*/
