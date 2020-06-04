const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const aulasController = require("../controllers/aulas.controller");
// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.

router.get("/listadoAulas", (req, res) => {
  res.render("listadoAulas.html");
});

router.get("/horariosCarrera", (req, res) => {
  res.render("horariosCarrera.html");
});

router.get("/detallesAula", (req, res) => {
  res.render("detallesAula.html");
});

module.exports = router;
