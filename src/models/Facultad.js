const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Carrera = require("Carrera.js");
const Facultad= sequelize.define(
    "facultad",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        nombre: {
            type: Sequelize.TEXT,
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
Facultad.hasMany(carrera);
module.exports = Facultad;