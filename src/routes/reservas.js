const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const key = "ya estoy harto";
const ensureToken = require("./user.js");
const reservasController = require("../controllers/reservas.controller")

// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.

router.get("/reservaDocente", ensureToken, (req, res) => {
  jwt.verify(req.token, key, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      //ESCRIBIR TODO ACA
      res.render("listadoReservas.html");
    }
  });
});

router.get("/reservaDocente/id/:id", ensureToken, (req, res) => {
    jwt.verify(req.token, key, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //ESCRIBIR TODO ACA
        res.send(reservasController.reservaDocente(req,res));
      }
    });
  });

router.get("/reservaAula", ensureToken, (req, res) => {
    jwt.verify(req.token, key, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //ESCRIBIR TODO ACA
        res.render("reservaAula.html");
      }
    });
  });

  router.get("/autorizarReserva", ensureToken, (req, res) => {
    jwt.verify(req.token, key, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //ESCRIBIR TODO ACA
        res.render("autorizarReserva.html", function (err,html));
      }
    });
  });

  router.post("/autorizarReserva/id/:id", ensureToken, (req, res) => {
    jwt.verify(req.token, key, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //ESCRIBIR TODO ACA
        res.send(reservasController.autorizarReserva(req,res));
      }
    });
  });

  router.post("/reservaAula/edificio/:edificio/dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/capacidad/:capacidad/periodo/:periodo", ensureToken, (req, res) => {
    jwt.verify(req.token, key, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //ESCRIBIR TODO ACA
        res.send(reservasController.buscarAulaReserva(req,res));
      }
    });
  });


  router.post("/reservaAula/dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/idAula/:idAula/codMateria/:codMateria/idDocente/:idDocente", ensureToken, (req, res) => {
    jwt.verify(req.token, key, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //ESCRIBIR TODO ACA
        res.send(reservasController.insertReserva(req,res));
      }
    });
  });







