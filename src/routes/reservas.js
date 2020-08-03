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
      res.sendStatus(404);
    } else {
      //ESCRIBIR TODO ACA
      reservasController.eliminarReservadocente(req,res);
    }
  });
});
router.post("/comentarAula", eToken, (req,res) => {
  jwt.verify(req.token, keyDocente, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      console.log("arre llego al router de reservas");
      //ESCRIBIR TODO ACA
      reservasController.comentarAula(req,res);
    }
  });
});
router.get("/listadoReservas", (req, res) => {
    res.render("listadoReservas.html");
});

router.get("/reservaDocente", eToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.sendStatus(404);
      } else {
        //ESCRIBIR TODO ACA
        req.params.id = data.id;
        reservasController.reservaDocente(req,res);
      }
    });
  });

router.get("/reservaAula", (req, res) => {
    res.render("reservaAula.html");
  });

  router.get("/autorizarReserva", (req, res) => {
        res.render("autorizarReserva.html");
  });

  router.post("/updateReserva", eToken, (req, res) => {
    jwt.verify(req.token, keyAdmin, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //ESCRIBIR TODO ACA
        req.body.id = data.id;
        reservasController.updateReservaAdmin(req,res);
      }
    });
  });

  router.post("/rechazarCoincidentes", eToken, (req, res) => {
    jwt.verify(req.token, keyAdmin, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //ESCRIBIR TODO ACA
        req.body.id = data.id;
        reservasController.updateCoincidente(req,res);
      }
    });
  });

  router.get("/allReservas", eToken, (req, res) => {
    console.log(req.token);
    jwt.verify(req.token, keyAdmin, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //ESCRIBIR TODO ACA
        req.params.id = data.id;
        console.log(req.params.id);
        reservasController.allReservas(req,res);
      }
    });
  });

  router.get("/filtrosReserva", eToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.sendStatus(404);
      } else {
        //ESCRIBIR TODO ACA
        return reservasController.getEdificios(req,res);
      }
    });
  }); 
  router.get("/buscarMateras/periodo/:periodo", eToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.sendStatus(404);
      } else {
        //ESCRIBIR TODO ACA
        req.params.idDoc = data.id;
        return reservasController.buscarMateria(req,res);
      }
    });
  });
  router.get("/buscarReservasCoincidentes/idAula/:idAula/periodo/:periodo/reservaId/:reservaId/horaIn/:horaIn/horaFin/:horaFin/dia/:dia", eToken, (req, res) => {
    jwt.verify(req.token, keyAdmin, (err, data) => {
      if (err) {
        res.sendStatus(404);
      } else {
        //ESCRIBIR TODO ACA
        return reservasController.buscarReservasCoincidentes(req,res); 
      }
    });
  });
  router.get("/buscarAulaReserva/edificio/:edificio/dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/capacidad/:capacidad/periodo/:periodo", eToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.sendStatus(404);
      } else {
        //ESCRIBIR TODO ACA
        return reservasController.buscarAula2(req,res); 
      }
    });
  });

///dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/idAula/:idAula/codMateria/:codMateria/idDocente/:idDocente
  router.post("/insertReserva", eToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.sendStatus(404);
      } else {
        req.body.idDocente = data.id;
        //ESCRIBIR TODO ACA
        reservasController.insertReserva(req,res);
      }
    });
  });

  router.get("/verificarAdmin/", eToken, (req, res) => {
    jwt.verify(req.token, keyAdmin, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        res.status(200).send("/autorizarReserva");
      }
    });
  });
  router.get("/verificarDocente/pagina/:pagina", eToken, (req, res) => {
    jwt.verify(req.token, keyDocente, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //ESCRIBIR TODO ACA
        switch(req.params.pagina){
            case "verReservas":{
                res.status(200).send("/listadoReservas");
                break;
            }
            case "reservarAula":{
              res.status(200).send("/reservaAula");
              break;
          }
        }
      }
    });
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

module.exports = router;





