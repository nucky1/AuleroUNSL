const db = {
    Aulas: require("../models/Aulas"),
    Edificio: require("../models/Edificio"),
    Carrera: require("../models/Carrera"),
    Docente: require("../models/Docente"),
    Facultad: require("../models/Facultad"),
    Reserva: require("../models/Reserva"),
    Materia: require("../models/Materia"),
    seq: require("sequelize"),
    ReservaMateria: require("../models/ReservaMateria"),
    ReservaAdmin : require("../models/ReservaAdmin")
};
module.exports = {
    //listado de reservas para administradores.
    //router.get("/allReservas", reservasController.allReservas);
    allReservas : async (req, res) => {
        const reservas = await db.Reserva.findAll({
            where: { state: "ACTIVO", estado : "PENDIENTE" },
            include: [
            {
                model: db.Aulas.Aula,
                where: { state: "ACTIVO"},
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
                }

            ]
        }).then(function(reservas){
            res.send(reservas);
        }, function(reason){
            console.log(reason);
            res.sendStatus(400);
        })
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
    getEdificios: async(req,res) =>{
        const edificios = await db.Edificio.findAll();
        res.send(edificios);
    },
    //busca que las aulas disponibles segun:
    //edificio, dia, between(hora inicio, hora inicia+cantHoras)
    //capAula > capacidad, periodo.
    //router.get("/buscarAulaReserva/edificio/:edificio/dia/:dia/horaInicio/:horaIn/cantHoras/:cantHoras/capacidad/:capacidad/periodo/:periodo", reservasController.buscarAulaReserva);
    buscarAulaReserva : async (req, res) => {
        const edificio = req.params.edificio;
        const dia = req.params.dia;
        const capacidad = req.params.capacidad;
        const horaIn = req.params.horaInicio;
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
        console.log( parseInt(horaIn)+(parseInt(cantHoras)));
        whereReserva.push({horaInicio :  {[db.seq.Op.notBetween]: [parseInt(horaIn), parseInt(horaIn)+(parseInt(cantHoras))]} });
        whereReserva.push({horaFin :  {[db.seq.Op.notBetween]: [parseInt(horaIn), parseInt(horaIn)+(parseInt(cantHoras))]} });

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

    buscarMateria : async (req, res) => {
        const periodo = req.params.periodo;
        const idDoc = req.params.idDoc;
        db.Materia.findAll({
            where : {periodo : periodo}
        }).then(function(materias) {
            console.log("se recuperaron las materias"+materias);
            res.send(materias);
           }, function(reason) {
            console.log("NO se recuperaron las materias"+reason);
            res.sendStatus(400);
        })
    
    },
    //router.post("/insertReserva", reservasController.insertReserva);
    /*"/reservaAula//dia/:dia/horaInicio/:horaInicio/cantHoras/:cantHoras/idAula/:idAula/codMateria/:codMateria/idDocente/:idDocente"*/
    insertReserva : async (req, res) => {
        const horaInicio = req.body.horaInicio;
        db.Reserva.create({
            dia : req.body.dia,
            horaInicio : parseInt(horaInicio),
            horaFin : parseInt(horaInicio) + (parseInt(req.body.cantHoras)*100),
            docenteId: req.body.idDocente,
            aulaId: req.body.idAula,
            estado: 'PENDIENTE',
        }).then(function(reserva) {
            console.log("inserto reserva"+reserva);
            db.ReservaMateria.create({
                reservaId : reserva.id,
                materiumId : req.body.codMateria
            }).then(function(reservaMatera) {
                console.log("termino la reserva materia"+reservaMatera);
                res.sendStatus(200);
               }, function(reason) {
                console.log("NO inserto reservaMateria"+reason);
                res.sendStatus(404);
            })
           }, function(reason) {
            console.log("NO inserto reserva"+reason);
            res.sendStatus(404);
        })
    },

    eliminarReservadocente: async (req, res) => {
        id = req.params.id;
        try{
        const x = await db.ReservaMateria.destroy({
            where:{
                reservaId:id
            }
        }).then(async function (resMateria){
            await db.Reserva.destroy({
                where: {
                    id:id
                }
            }).then(function(reserva){
                console.log("Reserva eliminada.");
                res.sendStatus(200);
            }, function(reason){
                console.log("NO se elimino la reserva."+reason);
                res.sendStatus(404);
            })
        },function(reason){
            console.log("Mal eliminar reserva "+reason);
            res.sendStatus(400);
        });
    }catch(err){
        console.log("ERROR"+err);
        res.sendStatus(400);
    }
    },

    updateReservaAdmin: async (req, res) =>{
        const id = req.body.id;
        const idReserva = req.body.idReserva;
        const estado = req.body.estado;
        console.log("body en update reserva " +req.body.idReserva);
        console.log("id admin  "+ id);
        try{
        const reserva = await db.Reserva.update(
            {
                estado:  estado
            },
            {
                where: {id : idReserva, state : 'ACTIVO'}
            }
        ).then(async function(reserva){
            console.log("Reserva actualizada "+reserva);
            console.log("id Reserva"+ idReserva);
        console.log("id admin"+ id);
            const reservaAdmin = await db.ReservaAdmin.create({
                administradorId : id,
                reservaId : idReserva
            }).then(function(reserva){
                console.log("Reserva actualizada "+reserva);
                res.sendStatus(200);
            }, function(reason){
                console.log("Mal update reservaAdin "+reason);
                res.sendStatus(400);
            });
        }, function(reason){
            console.log("Mal update reserva "+reason);
            res.sendStatus(400);
        });
        }catch(err){
            console.log("ERROR"+err);
            res.sendStatus(400);
        }
    }
};