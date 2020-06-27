const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

const keyDocente = "llave del docente";
const keyAdmin = "llave del admdinistrador";
const ensureToken = require("./user.js");
const reservasController = require("../controllers/reservas.controller")

// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.

router.post("/cancelarReserva", ensureToken, (req,res) => {
  jwt.verify(req.token, keyDocente, (err, data) => {
    if (err) {
      res.render("login.html");
    } else {
      //ESCRIBIR TODO ACA
      res.send(reservasController.eliminarReservadocente(req,res));
    }
  });
});

router.get("/listadoReservas", ensureToken, (req, res) => {
  jwt.verify(req.token, keyDocente, (err, data) => {
    if (err) {
      res.render("login.html");
    } else {
      //ESCRIBIR TODO ACA
      res.render("listadoReservas.html");
    }
  });
});

router.get("/reservaDocente", ensureToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        req.params.id = data.id;
        res.send(reservasController.reservaDocente(req,res));
      }
    });
  });

router.get("/reservaAula", ensureToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        res.render("reservaAula.html");
      }
    });
  });

  router.get("/autorizarReserva", ensureToken, (req, res) => {
    jwt.verify(req.token, keyAdmin, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        res.render("autorizarReserva.html");
      }
    });
  });

  router.post("/updateReserva", ensureToken, (req, res) => {
    jwt.verify(req.token, keyAdmin, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        req.params.id = data.id;
        res.send(reservasController.updateReservaAdmin(req,res));
      }
    });
  });

  router.get("/allReservas", ensureToken, (req, res) => {
    console.log(req.token);
    jwt.verify(req.token, keyAdmin, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        req.params.id = data.id;
        res.send(reservasController.allReservas(req,res));
      }
    });
  });

  router.post("/buscarAulaReserva/edificio/:edificio/dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/capacidad/:capacidad/periodo/:periodo", ensureToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        res.send(reservasController.buscarAulaReserva(req,res));
      }
    });
  });


  router.post("/insertReserva/dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/idAula/:idAula/codMateria/:codMateria/idDocente/:idDocente", ensureToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        res.send(reservasController.insertReserva(req,res));
      }
    });
  });
module.exports = router;





