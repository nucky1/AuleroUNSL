const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const userController = require("../controllers/user.controller");
const keyDocente = "llave del docente";
const keyAdmin = "llave del admdinistrador";

// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.

router.get("/login", (req, res) => {
  res.render("login.html");
});

router.post("/checkLogin",async (req, res) => {
  const user = await userController.getUser(req,res);
  var token;
  if(user.usuario != undefined){
    if(user.tipo == "ADMIN"){      
      token = jwt.sign({user: user.usuario, id: user.id }, keyAdmin);  
    }else{      
      token = jwt.sign({user: user.usuario, id: user.id }, keyDocente);       
    }
    console.log(token);
    res.send({user:user, token:token});
  }else{
    res.status(404).send("No user found");
  }
  
    
    /*Si los datos son validos:
    // genera token.
  
        Si es docente:
            ir a su pagina.
        Si no, es admin:
            ir a su pagina.
    Si los datos no son validos, informar*/
    
  
});

router.get("/pagprotegida", ensureToken, (req, res) => {
    //HACER ESTO SIEMPRE QUE SE ACCEDA A ALGUNA PAGINA DE DOCENTE O DE ADMIN.
  jwt.verify(req.token, keyDocente, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      //ESCRIBIR TODO ACA
      console.log(data);
      res.send("hola");
    }
  });
});

// VERIFICA TOKEN
function ensureToken(req, res, next) {
  const token = req.headers["token"];
    if (typeof token !== "undefined") {
      req.token = token;
      next();
    } else {
      res.render("login.html");
      next();
    }
}

module.exports = router;