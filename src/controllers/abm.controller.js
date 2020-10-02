const db = {
    Aulas: require("../models/Aulas"),
    Edificio: require("../models/Edificio"),
    Docente: require("../models/Docente"),
    Carrera: require("../models/Carrera"),
    Facultad: require("../models/Facultad"),
    Materia: require("../models/Materia"),
    Administrador: require("../models/Administrador"),
    Usuario: require("../models/Usuarios"),
    seq: require("sequelize")
  };
module.exports = {
    getDatosAdmin : async (req, res) => {
        console.log(req.params.pag*2);
        const result = await db.Usuario.findAndCountAll({
            offset: req.params.pag * req.params.limit,
            limit: req.params.limit,
            where: {
              state : "ACTIVO",
              tipo : "ADMIN"
            },
            include: [
              {
                model: db.Administrador,
              }
            ],
            order:[
                ["username","ASC"]
            ]
          });
          res.send(result);
    },
    getDatosDocente : async (req, res) => {
        const result = await db.Usuario.findAndCountAll({
            offset: req.params.pag * req.params.limit,
            limit: req.params.limit,
            where: {
              state : "ACTIVO",
              tipo : "DOCENTE" 
            },
            include: [
              {
                model: db.Docente
              }
            ],
            order:[
              ["username","ASC"]
            ]
          });
          res.send(result);
    },
    getDatosEdificio : async (req, res) => {
      const result = await db.Edificio.findAndCountAll({
          offset: req.params.pag * req.params.limit,
          limit: req.params.limit,
          where: {
            state : "ACTIVO",
          },
          order:[
            ["nombre","ASC"]
          ]
        });
        res.send(result);
    },
    getDatosAulas : async (req, res) => {
      const result = await db.Aulas.Aula.findAndCountAll({
          offset: req.params.pag * req.params.limit,
          limit: req.params.limit,
          where: {
            state : "ACTIVO",
          },
          include: [
            {
              model: db.Aulas.extra
            },
            {
              model: db.Edificio,
              as: "edificio",
            }
          ],
          order:[
            ["nombre","ASC"],["numero","ASC"]
          ]
        });
        res.send(result);
    },
    getDatosFacultad : async (req, res) => {
        const result = await db.Facultad.findAndCountAll({
            offset: req.params.pag * req.params.limit,
            limit: req.params.limit,
            where: {
              state : "ACTIVO"
            },
            order:[
              ["nombre","ASC"]
            ]
          });
          res.send(result);
    },
    getDatosCarrera : async (req, res) => {
        const result = await db.Carrera.findAndCountAll({
            offset: req.params.pag * req.params.limit,
            limit: req.params.limit,
            where: {
              state : "ACTIVO"
            },
            order:[
              ["nombre","ASC"]
            ]
          });
          res.send(result);
    },
    getDatosMateria : async (req, res) => {
        const result = await db.Materia.findAndCountAll({
            offset: req.params.pag * req.params.limit,
            limit: req.params.limit,
            where: {
              state : "ACTIVO"
            },
            order:[
              ["nombre","ASC"]
            ]
          });
          res.send(result);
    }

}