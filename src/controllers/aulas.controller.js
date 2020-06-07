const db = {
    Aulas: require('../models/Aulas'),
    Edificio: require('../models/Edificio'),
    Carrera: require('../models/Carrera'),
    Facultad: require('../models/Facultad'),
    Materia: require('../models/Materia'),
    Op : require('sequelize')
}; 


module.exports = {
    //retorna los filtros para listadoAulas.html
    getFiltrosAulas: async (req, res) => {
        const filtros= await db.Edificio.findAll({
            attributes: ['nombre'],
            include: [{
                model: db.Aulas.Aula,
                attributes: ['ubicacion'],
                
            }],
        })
        res.send(filtros);
    },
    //retorna los filtros para horariosCarrera.html
    getDatosFiltros: async (req, res) => {
        const filtros = await db.Facultad.findAll({
            attributes: ['nombre'],
            include: [{
                model: db.Carrera,
                attributes: ['nombre','cantAnios'],

            }]
        })
        res.send(filtros);
    },
        //req = {edificio, capacidad, ubicacion}
    filtrar:  async (req,res) =>{
        const edificio = req.params.edificio;
        const capacidad = req.params.capacidad;
        const ubicacion = req.params.ubicacion;
        const extras = req.params.extras.split(',');
        console.log(extras);
        whereAula = { state: 'ACTIVO'};
        whereEdificio = { state: 'ACTIVO'};
        if (edificio != "todos")
            whereEdificio.nombre = edificio;
        if (ubicacion != "todos")
                whereAula.ubicacion = ubicacion;

        whereAula.capacidad = { [db.Op.gte]: capacidad }
        const aulas = await db.Aulas.Aula.findAll({
            where: whereAula,
            include: [
                {
                    model: db.Edificio,
                    as: "edificio",
                    where: whereEdificio,
                    attributes: ['nombre'],
                },
                {
                    model: db.Aulas.extra,
                    as: "extras",
                    attributes: ['extra'],
                }
            ]
        }).then(function(aulas){
            filtroExtras = [];
            aulas.forEach(elemento => { 
                flag = true; 
                elemento.extras.forEach(element => {
                    if (!extras.includes(element.get('extra')))
                        flag = false;
                });
                if (flag && elemento.extras.length == extras.length ) {
                    filtroExtras.push(elemento);
                }
            });
            res.send(filtroExtras);
        })
        
    },

    filtrarPorCarrera: async (req,res) => {
        const facultad = req.params.facultad;
        const carrera = req.params.carrera;
        const anio = req.params.anio;
        const periodo = req.params.periodo;

        
        whereFacultad = { state: 'ACTIVO'};
        whereCarrera = { state: 'ACTIVO'};
        whereMateria = { state: 'ACTIVO'};
        
        if (facultad != "todos")
            whereFacultad.nombre = facultad;
        if (carrera != "todos")
            whereCarrera.nombre = carrera;
        if (anio != "todos")
            whereMateria.anio = anio;
        if (periodo != "todos")
            whereMateria.periodo = periodo;

        const aulas = db.Carrera.findAll({
            where: whereCarrera,
            include: [
                {
                    model: db.Facultad,
                    as: "facultad",
                    where: whereFacultad,
                    attributes: ['nombre']
                },
                {
                    model: db.Materia,
                    as: "materia",
                    where: whereMateria,
                    attributes: ['nombre']
                },
                {
                    model: db.Aulas.Aula,
                    as: "aula",
                    where:{
                        state: 'ACTIVO'
                    },
                    attributes: ['nombre','numero']
                },
                {
                    model: db.Reserva,
                    as: "reserva",
                    where:{
                        estado: 'AUTORIZADA',
                        state: 'ACTIVO'
                    },
                    attributes: ['dia','horaInicio','horaFin']
                }
            ]
        })
    }
}