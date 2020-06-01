const Aulas = require('../models/Aulas');

module.exports = {
    getAulas:  async (req,res) =>{
        const aulas = await Aulas.findAll();
        res.render('listaAulas.html', {aulas});
    },

    getDetalleAula: async (req,res) =>{
        const id = req.params.id;
        const aula = await Aulas.findOne({
            where: {
                id: id
            }
        })
        res.send(aula);
    },

    getAulasEdificio: async (req,res) =>{
        const edificio = req.params.edificio;
        const aulas = await Aulas.findAll({
            where: {
                edificio: edificio
            }
        })
        res.send(aulas);
    }
}