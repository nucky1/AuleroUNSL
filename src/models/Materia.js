const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const CarreraMateria = require("CarreraMateria.js");
const ReservaMateria = require("ReservaMateria.js");
const Carrera = require("Carrera.js");
const Reserva = require("Reserva.js");
const Materia = sequelize.define(
    "materia",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        nombre: {
            type: Sequelize.TEXT,
        },
        periodo: {
            type: Sequalize.ENUM,
            values: ['primer cuatrimestre', 'segundo cuatrimestre', 'anual']
        },
        anio: {
            type: Sequelize.INTEGER,
        },
        cod: {
            type: Sequalize.INTEGER,
            unique: true,
        },
        state: {
            type: Sequalize.ENUM,
            values: ['ACTIVO', 'INACTIVO', 'BAJA']
        },
        createdAt: {
            type: Sequelize.DATE,
        },
        updatedAt: {
            type: Sequelize.DATE,
        }
    },
    {
        timestamps: false,
    }
);
Materia.belongsToMany(Carrera, { through: CarreraMateria });
Materia.belongsToMany(Reserva, { through: ReservaMateria });
module.exports = Materia;