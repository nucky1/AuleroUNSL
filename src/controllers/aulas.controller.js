const db = {
    Aulas: require('../models/Aulas'),
    Edificio: require('../models/Edificio')
}; 


module.exports = {
        //req = {edificio, capacidad, ubicacion}
    filtrar:  async (req,res) =>{
        const edificio = req.params.edificio;
        const capacidad = req.params.capacidad;
        const ubicacion = req.params.ubicacion;
        const aulas = await db.Aulas.findAll()
        /*whereAula = {};
        whereEdificio = {};
        if (edificio != "todos")
            whereEdificio.nombre = edificio;
        if (capacidad != "todos")
            whereAula.capacidad = capacidad;
        if (ubicacion != "todos")
            whereAula.ubicacion = ubicacion;
        const aulas = await db.Aulas.findAll({
            where: whereAula,
            include: [
                {
                    model: db.Edificio,
                    as: "edificio",
                    where: whereEdificio,
                    attributes: ['nombre'],
                }
            ]
        });*/
        res.send(aulas)
    }
}