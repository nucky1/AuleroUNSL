const express = require("express");
const router = express.Router();
const morgan = require("morgan");

// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.

// Si un usuario visita la pagina principal:
router.get("/Principal", (req, res) => {
  res.render("Principal.html"); // uso render ya que usamos el motor de vista ejs.
});

// Exporto "router" a los demas archivos que lo necesiten.
module.exports = router;
