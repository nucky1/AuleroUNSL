const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const aulasController = require("../controllers/aulas.controller");
// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.

// Si un usuario visita la pagina listado de aulas:
router.get("/aulas", aulasController.getAulas(req,res));
router.get("/aulas/:id", aulasController.getDetalleAula(req,res));
router.get("/aulas/:edificio", aulasController.getAulasEdificio(req,res));
// Exporto "router" a los demas archivos que lo necesiten.
module.exports = router;