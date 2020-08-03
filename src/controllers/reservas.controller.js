const db = {
  Aulas: require("../models/Aulas"),
  Edificio: require("../models/Edificio"),
  Carrera: require("../models/Carrera"),
  Docente: require("../models/Docente"),
  Facultad: require("../models/Facultad"),
  Reserva: require("../models/Reserva"),
  Comentario: require("../models/Comentario"),
  ComentarioDocente: require("../models/comentarioDocente"),
  Materia: require("../models/Materia"),
  seq: require("sequelize"),
  ReservaMateria: require("../models/ReservaMateria"),
  ReservaAdmin: require("../models/ReservaAdmin"),
};
module.exports = {
  //listado de reservas para administradores.
  //router.get("/allReservas", reservasController.allReservas);
  allReservas: async (req, res) => {
    const reservas = await db.Reserva.findAll({
      where: { state: "ACTIVO"},
      include: [
        {
          model: db.Aulas.Aula,
          where: { state: "ACTIVO" },
          attributes: ["id", "nombre", "numero", "ubicacion"],
        },
        {
          model: db.Docente,
          where: { state: "ACTIVO" },
          //attributes: ["nombre","apellido"]
        },
        {
          model: db.Materia,
          where: { state: "ACTIVO" },
          attributes: ["nombre", "periodo"],
        },
      ],
    }).then(
      function (reservas) {
        res.send(reservas);
      },
      function (reason) {
        console.log(reason);
        res.sendStatus(400);
      }
    );
  },
  //listado de reservas para un docente.
  //router.get("/reservaDocente/id/:id", reservasController.reservaDocente);
  reservaDocente: async (req, res) => {
    const docenteId = req.params.id;
    const reservas = await db.Reserva.findAll({
      where: {
        docenteId: docenteId,
        state: "ACTIVO",
      },
      include: [
        {
          model: db.Aulas.Aula,
          where: { state: "ACTIVO" },
          attributes: ["id", "nombre", "numero", "ubicacion"],
        },
        {
          model: db.Docente,
          where: { state: "ACTIVO" },
          //attributes: ["nombre","apellido"]
        },
        {
          model: db.Materia,
          where: { state: "ACTIVO" },
          attributes: ["nombre", "periodo"],
        },
      ],
    });
    res.send(reservas);
  },
  getEdificios: async (req, res) => {
    const edificios = await db.Edificio.findAll();
    res.send(edificios);
  },
  //busca que las aulas con la reserva en el mismo horario
  buscarReservasCoincidentes: async (req, res) => {
    const idReserva = req.params.reservaId;
    const idAula = req.params.idAula;
    const horaIn = req.params.horaIn;
    const horaFin = req.params.horaFin;
    const periodo = req.params.periodo;
    const dia = req.params.dia;
    whereReserva = [{id: {[db.seq.Op.ne]: idReserva}},{ state: "ACTIVO" }, { aulaId: idAula },{estado : 'PENDIENTE'}];
    if(periodo == 'primer cuatrimestre'){
      whereReserva.push({periodo:{ [db.seq.Op.in]:['primer cuatrimestre','anual']}});
    }else{
      if(periodo == 'segundo cuatrimestre'){
        whereReserva.push({periodo:{ [db.seq.Op.in]:['segundo cuatrimestre','anual']}});
      }
    }
    whereReserva.push({ dia: dia });
    wherehorario = [
      {
        horaInicio: {
          [db.seq.Op.between]: [
            horaIn,
            horaFin,
          ],
        },
      },
    ];
    wherehorario.push({
      horaFin: {
        [db.seq.Op.between]: [
          horaIn,
          horaFin,
        ],
      },
    });
    whereReserva.push({ [db.seq.Op.or]: wherehorario });
    console.log(whereReserva)
    await db.Reserva.findAll({
      where: { [db.seq.Op.and]: whereReserva },
      include: [
        {
          model: db.Docente,
          where: { state: "ACTIVO" },
        },
        {
          model: db.Materia,
          where: { state: "ACTIVO" },
          attributes: ["nombre", "periodo"],
        },
      ],
    }).then(function (reservas) {
            console.log("se recuperaron las reservas" + reservas);
            res.send(reservas);
          },
          function (reason) {
            console.log("NO se recuperaron las reservas" + reason);
            res.sendStatus(400);
          }
        );
  },
  //buscar aula disponible alternative
  buscarAula2: async (req, res) => {
    const edificio = req.params.edificio;
    const dia = req.params.dia;
    const capacidad = req.params.capacidad;
    const horaIn = parseInt(req.params.horaInicio,10);
    const cantHoras = parseInt(req.params.cantHoras,10);
    const horaFin = horaIn + cantHoras;
    const periodo = req.params.periodo;
    whereReserva = [{ state: "ACTIVO" }, { periodo: periodo },{estado : 'AUTORIZADA'}];
    let whereEdif = {
      [db.seq.Op.and]: [{ state: "ACTIVO" }, { nombre: edificio }],
    };
    if (dia != "todos") whereReserva.push({ dia: dia });
    wherehorario = [
      {
        horaInicio: {
          [db.seq.Op.between]: [
            horaIn,
            horaFin,
          ],
        },
      },
    ];
    wherehorario.push({
      horaFin: {
        [db.seq.Op.between]: [
          horaIn,
          horaFin,
        ],
      },
    });
    whereReserva.push({ [db.seq.Op.or]: wherehorario });
    await db.Reserva.findAll({
      where: { [db.seq.Op.and]: whereReserva },
      include: [
        {
          model: db.Aulas.Aula,
          attributes: ["id"],
        },
      ],
    }).then(
      async function (reservas) {
        ids = [];
        for (let reserva in reservas) {
          ids.push(reservas[reserva].aula.id);
        }
        await db.Aulas.Aula.findAll({
          where: {
            [db.seq.Op.and]: [
              { state: "ACTIVO" },
              { id: { [db.seq.Op.notIn]: ids } },
              { capacidad: { [db.seq.Op.gte]: capacidad } },
            ],
          },
          include: [
            {
              model: db.Edificio,
              where: whereEdif,
            },
          ],
        }).then(
          function (aulas) {
            console.log("se recuperaron las aulas" + aulas);
            res.send(aulas);
          },
          function (reason) {
            console.log("NO se recuperaron las aulas" + reason);
            res.sendStatus(400);
          }
        );
      },
      function (reason) {
        console.log("Error en buscar reserva: " + reason);
      }
    );
  },
  buscarMateria: async (req, res) => {
    const periodo = req.params.periodo;
    const idDoc = req.params.idDoc;
    db.Materia.findAll({
      where: { [db.seq.Op.and]: [{ state: "ACTIVO" }, { periodo: periodo }] },
    }).then(
      function (materias) {
        console.log("se recuperaron las materias" + materias);
        res.send(materias);
      },
      function (reason) {
        console.log("NO se recuperaron las materias" + reason);
        res.sendStatus(400);
      }
    );
  },
  //router.post("/insertReserva", reservasController.insertReserva);
  /*"/reservaAula//dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/idAula/:idAula/codMateria/:codMateria/idDocente/:idDocente"*/
  insertReserva: async (req, res) => {
    const horaInicio = req.body.horaInicio;
    db.Reserva.create({
      dia: req.body.dia,
      horaInicio: parseInt(horaInicio),
      horaFin: parseInt(horaInicio) + parseInt(req.body.cantHoras),
      docenteId: req.body.idDocente,
      aulaId: req.body.idAula,
      estado: "PENDIENTE",
      periodo: req.body.periodo,
    }).then(
      function (reserva) {
        console.log("inserto reserva" + reserva);
        db.ReservaMateria.create({
          reservaId: reserva.id,
          materiumId: req.body.codMateria,
        }).then(
          function (reservaMatera) {
            console.log("termino la reserva materia" + reservaMatera);
            res.sendStatus(200);
          },
          function (reason) {
            console.log("NO inserto reservaMateria" + reason);
            res.sendStatus(404);
          }
        );
      },
      function (reason) {
        console.log("NO inserto reserva" + reason);
        res.sendStatus(404);
      }
    );
  },

  eliminarReservadocente: async (req, res) => {
    id = req.body.id;
    try {
        await db.ReservaAdmin.destroy({
            where:{
                reservaId: id
            }
        });
        await db.ReservaMateria.destroy({
        where: {
          reservaId: id,
        },
      }).then(
        async function (resMateria) {
          await db.Reserva.destroy({
            where: {
              id: id,
            },
          }).then(
            function (reserva) {
              console.log("Reserva eliminada.");
              res.sendStatus(200);
            },
            function (reason) {
              console.log("NO se elimino la reserva." + reason);
              res.sendStatus(404);
            }
          );
        },
        function (reason) {
          console.log("Mal eliminar reserva " + reason);
          res.sendStatus(400);
        }
      );
    } catch (err) {
      console.log("ERROR" + err);
      res.sendStatus(400);
    }
  },
  updateCoincidente: async (req, res) => {
    const id = req.body.id;
    var idReserva;
    if( req.body.idReservas.includes(",")){
      idReserva = req.body.idReservas.split(",");
    }else{
      idReserva = req.body.idReservas;
    }
    console.log("body en update reserva " + idReserva);
    console.log("id admin  " + id);
    try {
      const reserva = await db.Reserva.update(
        {
          estado: 'RECHAZADA',
        },
        {
          where: { id:{[db.seq.Op.in]:idReserva}, state: "ACTIVO" },
        }
      ).then(
        async function (reserva) {
          console.log("Reserva actualizada " + reserva);
          console.log("id Reserva" + idReserva);
          console.log("id admin" + id);
          var idsReserva = [];
          if(Array.isArray(idReserva)){
            idReserva.forEach(element => {
              idsReserva.push({administradorId: id, reservaId: element});
            });
          }else{
              idsReserva.push({administradorId: id, reservaId: idReserva});
          }
          const reservaAdmin = await db.ReservaAdmin.bulkCreate({
            idsReserva
          }).then(
            function (reserva) {
              console.log("Reserva actualizada " + reserva);
              res.sendStatus(200);
            },
            function (reason) {
              console.log("Mal update reservaAdin " + reason);
              res.sendStatus(400);
            }
          );
        },
        function (reason) {
          console.log("Mal update reserva " + reason);
          res.sendStatus(400);
        }
      );
    } catch (err) {
      console.log("ERROR" + err);
      res.sendStatus(400);
    }
  },
  updateReservaAdmin: async (req, res) => {
    const id = req.body.id;
    const idReserva = req.body.idReserva;
    const estado = req.body.estado;
    console.log("id admin  " + id);
    try {
      const reserva = await db.Reserva.update(
        {
          estado: estado,
        },
        {
          where: { id: idReserva, state: "ACTIVO" },
        }
      ).then(
        async function (reserva) {
          console.log("Reserva actualizada " + reserva);
          console.log("id Reserva" + idReserva);
          console.log("id admin" + id);
          const reservaAdmin = await db.ReservaAdmin.create({
            administradorId: id,
            reservaId: idReserva,
          }).then(
            function (reserva) {
              console.log("Reserva actualizada " + reserva);
              res.sendStatus(200);
            },
            function (reason) {
              console.log("Mal update reservaAdin " + reason);
              res.sendStatus(400);
            }
          );
        },
        function (reason) {
          console.log("Mal update reserva " + reason);
          res.sendStatus(400);
        }
      );
    } catch (err) {
      console.log("ERROR" + err);
      res.sendStatus(400);
    }
  },
  comentarAula: async (req, res) => {
    const horaInicio = req.body.horaInicio;
    db.Comentario.create({
      texto: req.body.comentario,
      aulaId: req.body.idAula,
    }).then(
      function (comentario) {
        console.log("inserto comentario" + comentario);
        db.ComentarioDocente.create({
          comentarioId: comentario.id,
          docenteId: req.body.idDoc,
        }).then(
          function (comentarioDocente) {
            console.log("termino la reserva materia" + comentarioDocente);
            res.sendStatus(200);
          },
          function (reason) {
            console.log("NO inserto comentarioDocente" + reason);
            res.sendStatus(404);
          }
        );
      },
      function (reason) {
        console.log("NO inserto comentario" + reason);
        res.sendStatus(404);
      }
    );
  },
  
};
