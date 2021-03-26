const express = require("express");
const router = express.Router();
const morgan = require("morgan");

const jwt = require("jsonwebtoken");

const keySuperAdm = "llave del super admin";
// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.
const abmController = require("../controllers/abm.controller");

router.get("/ABM", (req, res) => {
    res.render("ABM.html");
  });

router.get("/getDatosAdmin/limit/:limit/pag/:pag", (req, res) => {
  jwt.verify(req.token, keySuperAdm, (err, data) => {
    if (err) {
      
      abmController.getDatosAdmin(req,res);
      //res.sendStatus(404);
    } else {
      //ESCRIBIR TODO ACA
      abmController.getDatosAdmin(req,res);
    }
  })
});
router.get("/getDatosDocente/limit/:limit/pag/:pag",eToken, (req, res) => {
  jwt.verify(req.token, keySuperAdm, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      //ESCRIBIR TODO ACA
      abmController.getDatosDocente(req,res);
    }
  })
});
router.get("/getDatosEdificio/limit/:limit/pag/:pag",eToken, (req, res) => {
  jwt.verify(req.token, keySuperAdm, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      //ESCRIBIR TODO ACA
      abmController.getDatosEdificio(req,res);
    }
  })
});
router.get("/getDatosAulas/limit/:limit/pag/:pag",eToken, (req, res) => {
  jwt.verify(req.token, keySuperAdm, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      //ESCRIBIR TODO ACA
      abmController.getDatosAulas(req,res);
    }
  })
});
router.get("/getDatosFacultad/limit/:limit/pag/:pag",eToken, (req, res) => {
  jwt.verify(req.token, keySuperAdm, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      //ESCRIBIR TODO ACA
      abmController.getDatosFacultad(req,res);
    }
  })
});
router.get("/getDatosCarrera/limit/:limit/pag/:pag",eToken, (req, res) => {
  jwt.verify(req.token, keySuperAdm, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      //ESCRIBIR TODO ACA
      abmController.getDatosCarrera(req,res);
    }
  })
});
router.get("/getDatosMateria/limit/:limit/pag/:pag",eToken, (req, res) => {
  jwt.verify(req.token, keySuperAdm, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      //ESCRIBIR TODO ACA
      abmController.getDatosMateria(req,res);
    }
  })
});

function eToken(req, res, next) {
  const token = req.headers["token"];
  console.log(token);
  if (typeof token !== "undefined") {
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
}
  // Exporto "router" a los demas archivos que lo necesiten.
  module.exports = router;
   