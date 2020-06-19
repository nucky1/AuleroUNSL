const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const userController = require("../controllers/user.controller");
const key = "ya estoy harto";

// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.

router.get("/login", (req, res) => {
  res.render("login.html");
});

router.post("/login", (req, res) => {
  const user = req.params.user;
  const password = req.params.password;
  //autorizar bla bla
    /*
    Si los datos son validos:
    // genera token.
        const token = jwt.sign({ user }, key);
        Si es docente:
            ir a su pagina.
        Si no, es admin:
            ir a su pagina.
    Si los datos no son validos, informar
    */
  
});

app.get("/pagprotegida", ensureToken, (req, res) => {
    //HACER ESTO SIEMPRE QUE SE ACCEDA A ALGUNA PAGINA DE DOCENTE O DE ADMIN.
  jwt.verify(req.token, key, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      //ESCRIBIR TODO ACA
      res.render("pagprotegida.js");
    }
  });
});

// VERIFICA TOKEN
function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}
