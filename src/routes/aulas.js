const express = require("express");
const router = express.Router();
const morgan = require("morgan");
const aulasController = require("../controllers/aulas.controller");
var periodo;
var id;

// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.

router.get("/", (req, res) => {
    res.render("Principal.html");
});
router.get("/listadoAulas", (req, res) => {
  res.render("listadoAulas.html");
});

router.get("/horariosCarrera", (req, res) => {
  res.render("horariosCarrera.html");
});
router.get("/detallesAula", (req, res) => {
    res.render("detallesAula.html");
});

//retorna datos para detallesAula
router.get("/getDetalles/id/:id", aulasController.getDetallesAula);
//retorna los comentarios de un aula
router.get("/allComentarios/id/:id", aulasController.allComentario);
//retorna los filtros para listadoAulas.html
router.get("/getFiltrosAulas", aulasController.getFiltrosAulas);
//retorna los filtros para horariosCarrera.html
router.get("/getDatosFiltros", aulasController.getDatosFiltros);

router.get("/getHorariosReserva/id/:id/periodo/:periodo", aulasController.detallesAula);

router.get("/listadoAulas/edificio/:edificio/capacidad/:capacidad/ubicacion/:ubicacion/extras/:extras", aulasController.filtrar);

router.get("/horariosCarrera/facultad/:facultad/carrera/:carrera/anio/:anio/periodo/:periodo",aulasController.filtrarPorCarrera);
module.exports = router;


