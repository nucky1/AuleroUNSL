const express = require("express");
const router = express.Router();
const morgan = require("morgan");

// Middleware (se ejecuta antes de todas las peticiones)
router.use(morgan("tiny")); // muestra por consola.
router.use(express.json()); // convierte datos a json.

router.get("/ABM", (req, res) => {
    res.render("ABM.html");
  });
  
  // Exporto "router" a los demas archivos que lo necesiten.
  module.exports = router;
  