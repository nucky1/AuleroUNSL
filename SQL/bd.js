const Aula = require('../src/models/Aulas.js');

let aulas = [
    new Aula("Sala", "57", "bloque 2", 50, "Planta baja", "Habilitada")
];

module.exports = {
    getAulas: () => {
        return aulas;
    },
    getAulasPorEdificio: (edificio) => {
        if (edificio = aulas[0].edificio){
            return aulas[0];
        }
    }
}


