const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const morgan = require("morgan");

const keyDocente = "llave del docente";
const keyAdmin = "llave del admdinistrador";
const reservasController = require("../controllers/reservas.controller")

// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.

router.post("/cancelarReserva", eToken, (req,res) => {
  jwt.verify(req.token, keyDocente, (err, data) => {
    if (err) {
      res.render("login.html");
    } else {
      //ESCRIBIR TODO ACA
      res.send(reservasController.eliminarReservadocente(req,res));
    }
  });
});

router.get("/listadoReservas", eToken, (req, res) => {
  jwt.verify(req.token, keyDocente, (err, data) => {
    if (err) {
      res.render("login.html");
    } else {
      //ESCRIBIR TODO ACA
      res.render("listadoReservas.html");
    }
  });
});

router.get("/reservaDocente", eToken, (req, res) => {
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

router.get("/reservaAula", eToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        res.render("reservaAula.html");
      }
    });
  });

  router.get("/autorizarReserva", eToken, (req, res) => {
    jwt.verify(req.token, keyAdmin, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        res.render("autorizarReserva.html");
      }
    });
  });

  router.post("/updateReserva", eToken, (req, res) => {
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

  router.get("/allReservas", eToken, (req, res) => {
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

  router.post("/buscarAulaReserva/edificio/:edificio/dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/capacidad/:capacidad/periodo/:periodo", eToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        res.send(reservasController.buscarAulaReserva(req,res));
      }
    });
  });


  router.post("/insertReserva/dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/idAula/:idAula/codMateria/:codMateria/idDocente/:idDocente", eToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.render("login.html");
      } else {
        //ESCRIBIR TODO ACA
        res.send(reservasController.insertReserva(req,res));
      }
    });
  });


  function eToken(req, res, next) {
    const bearerHeader = req.headers["token"];
    console.log(req.headers.token);
    if (typeof bearerHeader !== "undefined") {
      
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[0];
      req.token = bearerToken;
      next();
    } else {
      res.render("login.html");
    }
  }

module.exports = router;





