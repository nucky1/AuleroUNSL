const db = {
  Aulas: require("../models/Aulas"),
  Edificio: require("../models/Edificio"),
  Carrera: require("../models/Carrera"),
  Facultad: require("../models/Facultad"),
  Reserva: require("../models/Reserva"),
  Materia: require("../models/Materia"),
  ReservaMateria: require("../models/ReservaMateria"),
};

module.exports = {
  getDatosFiltros: async (req, res) => {
    const filtros = await db.Facultad.findAll({
      attributes: ["nombre"],
      include: [
        {
          model: db.Carrera,
          attributes: ["nombre", "cantAnios"],
        },
      ],
    });
    res.send(filtros);
  },
  //req = {edificio, capacidad, ubicacion}
  filtrar: async (req, res) => {
    const edificio = req.params.edificio;
    const capacidad = req.params.capacidad;
    const ubicacion = req.params.ubicacion;
    const extras = req.params.extras.split(",");
    console.log(extras);
    whereAula = { state: "ACTIVO" };
    whereEdificio = { state: "ACTIVO" };
    if (edificio != "todos") whereEdificio.nombre = edificio;
    if (capacidad != "todos") whereAula.capacidad = capacidad;
    if (ubicacion != "todos") whereAula.ubicacion = ubicacion;
    const aulas = await db.Aulas.Aula.findAll({
      where: whereAula,
      include: [
        {
          model: db.Edificio,
          as: "edificio",
          where: whereEdificio,
          attributes: ["nombre"],
        },
        {
          model: db.Aulas.extra,
          as: "extras",
          attributes: ["extra"],
        },
      ],
    }).then(function (aulas) {
      filtroExtras = [];
      aulas.forEach((elemento) => {
        flag = true;
        elemento.extras.forEach((element) => {
          if (!extras.includes(element.get("extra"))) flag = false;
        });
        if (flag && elemento.extras.length == extras.length) {
          filtroExtras.push(elemento);
        }
      });
      res.send(filtroExtras);
    });
  },

  filtrarPorCarrera: async (req, res) => {
    const facultad = req.params.facultad;
    const carrera = req.params.carrera;
    const anio = req.params.anio;
    const periodo = req.params.periodo;

    whereFacultad = { state: "ACTIVO" };
    whereCarrera = { state: "ACTIVO" };
    whereMateria = { state: "ACTIVO" };

    if (facultad != "todos") whereFacultad.nombre = facultad;
    if (carrera != "todos") whereCarrera.nombre = carrera;
    if (anio != "todos") whereMateria.anio = anio;
    if (periodo != "todos") whereMateria.periodo = periodo;
    const aulas = await db.Materia.findAll({
      where: whereMateria,
      include: [
        {
          model: db.Carrera,
          where: whereCarrera,
          include: [
            {
              model: db.Facultad,
              where: whereFacultad,
            },
          ],
        },
        {
          model: db.Reserva,
          where: {
            estado: "AUTORIZADA",
            state: "ACTIVO",
          },
          include: [
            {
              model: db.Aulas.Aula,
              where: {
                state: "ACTIVO",
              },
            },
          ],
        },
      ],
    });
    res.send(aulas);
  },

  detallesAula: async (req, res) => {
    const id = req.params.id;
    const periodo = req.params.periodo;

    const aula = await db.Aulas.Aula.findAll({
      where: {
        id: id,
      },
      include: [
        {
          model: db.Edificio,
          as: "edificio",
          attributes: ["nombre"],
        },
        {
          model: db.Reserva,
          attributes: ["dia", "horaInicio", "horaFin"],
          include: [
            {
              model: db.Materia,
              where: {
                periodo: periodo,
              },
            },
          ],
        },
        {
          model: db.Aulas.extra,
          as: "extras",
          attributes: ["extra"],
        },
      ],
    });
    res.send(aula);
  },
};
