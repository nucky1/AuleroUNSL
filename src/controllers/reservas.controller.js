const db = {
    Aulas: require("../models/Aulas"),
    Edificio: require("../models/Edificio"),
    Carrera: require("../models/Carrera"),
    Facultad: require("../models/Facultad"),
    Reserva: require("../models/Reserva"),
    Materia: require("../models/Materia"),
    seq: require("sequelize"),
    ReservaMateria: require("../models/ReservaMateria")
};
module.exports = {
    //listado de reservas para administradores.
    //router.get("/allReservas", reservasController.allReservas);
    allReservas : async (req, res) => {
        const reservas = await db.Reserva.findAll({
            where: { state: "ACTIVO" },
            include: [
            {
                model: db.Aulas.Aula,
                where: { state: "ACTIVO" },
                attributes: ["id","nombre","numero","ubicacion"],
            },
            {
                model : db.Docente,
                where: { state: "ACTIVO" },
                //attributes: ["nombre","apellido"]
            },
            {
                model : db.Materia,
                where: { state: "ACTIVO" },
                attributes: ["nombre","periodo"]
                },

            ]
        });
        res.send(reservas);
    },
    //listado de reservas para un docente.
    //router.get("/reservaDocente/id/:id", reservasController.reservaDocente);
    reservaDocente : async (req, res) => {
        const docenteId = req.params.id;
        const reservas = await db.Reserva.findAll({
            where : {
                docenteId : docenteId,
                state: "ACTIVO"
            },
            include: [
            {
                model: db.Aulas.Aula,
                where: { state: "ACTIVO" },
                attributes: ["id","nombre","numero","ubicacion"],
            },
            {
                model : db.Docente,
                where: { state: "ACTIVO" },
                //attributes: ["nombre","apellido"]
            },
            {
                model : db.Materia,
                where: { state: "ACTIVO" },
                attributes: ["nombre","periodo"]
                },

            ]
        });
        res.send(reservas);
    },
    //busca que las aulas disponibles segun:
    //edificio, dia, between(hora inicio, hora inicia+cantHoras)
    //capAula > capacidad, periodo.
    //router.get("/buscarAulaReserva/edificio/:edificio/dia/:dia/horaIn/:horaIn/cantHoras/:cantHoras/capacidad/:capacidad/periodo/:periodo", reservasController.buscarAulaReserva);
    buscarAulaReserva : async (req, res) => {
        const edificio = req.params.edificio;
        const dia = req.params.dia;
        const capacidad = req.params.capacidad;
        const horaIn = req.params.horaIn;
        const cantHoras = req.params.cantHoras;
        const periodo = req.params.periodo;
        whereReserva = [{ state: "ACTIVO" }];
        whereEdif = { [db.seq.Op.and]: [
                { state: "ACTIVO" },
                {nombre : edificio}
            ] };
        whereAula = [{ state: "ACTIVO" }];
        whereAula.push({ capacidad: { [db.seq.Op.gte]: capacidad } });
        if(dia != "todos")  whereReserva.push({dia : dia});
        whereReserva.push({horaInicio : { [db.seq.Op.not]: {[Op.notBetween]: [parseInt(horaIn), parseInt(horaIn)+(parseInt(cantHoras)*100)]} } });
        whereReserva.push({horaFin : { [db.seq.Op.not]: {[Op.notBetween]: [parseInt(horaIn), parseInt(horaIn)+(parseInt(cantHoras)*100)]} } });

        const aulas = await db.Aulas.Aula.findAll({
            where : {[db.seq.Op.and]: whereAula},
            include:[
                {
                    model: db.Edificio,
                    where : whereEdif
                },
                {
                    model: db.Reserva,
                    where : {[db.seq.Op.and]: whereReserva},
                    include: [
                        {
                            model: db.Materia,
                            where:{ periodo: periodo},
                            attributes:[]
                        }
                    ]
                },
                
            ],
        });
        res.send(aulas); 
    },
    //insert reserva
    //router.post("/insertReserva", reservasController.insertReserva);
    /*"/reservaAula//dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/idAula/:idAula/codMateria/:codMateria/idDocente/:idDocente"*/
    insertReserva : async (req, res) => {
        const horaInicio = req.params.horaInicio;
        db.Reserva.create({
            dia : req.params.dia,
            horaInicio : parseInt(horaInicio),
            horaFin : parseInt(horaInicio) + (parseInt(req.params.cantHoras)*100),
            docenteId: idDocente,
            aulaId: req.params.idAula,
            estado: 'PENDIENTE',
        }).then(function(reserva) {
            console.log("inserto reserva"+reserva);
            db.ReservaMateria.create({
                reservaId : reserva.id,
                materiumId : req.params.codMateria
            }).then(function(reservaMatera) {
                console.log("termino la reserva materia"+reservaMatera);
                res.sendStatus(201);
               }, function(reason) {
                console.log("NO inserto reservaMateria"+reason);
                res.sendStatus(400);
            })
           }, function(reason) {
            console.log("NO inserto reserva"+reason);
            res.sendStatus(400);
        })
    },

    eliminarReservadocente: async (req, res) => {
        id = req.params.id;
        db.Reserva.destroy({
            where: {
                id:id
            }
        }).then(function(reserva){
            console.log("Reserva eliminada.");
            res.sendStatus(201);
        }, function(reason){
            console.log("NO se elimino la reserva."+reason);
            res.sendStatus(400);
        })
    },

    updateReservaAdmin: async (req, res) =>{
        
    }
};