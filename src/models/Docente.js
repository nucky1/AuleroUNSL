const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Reserva = require("Reserva.js");
const Docente = sequelize.define(
    "docente",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        nombre: {
            type: Sequelize.TEXT,
        },
        apellido: {
            type: Sequelize.TEXT,
        },
        idUsuario: {
            type: Sequelize.INTEGER,
            references: {
                model: 'usuarios',
                key: 'id',
            }
        },
        dni: {
            type: Sequalize.INTEGER,
        },
        legajo: {
            type: Sequalize.TEXT,
        },
        ubicacion: {
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
Docente.hasMany(Reserva);
module.exports = Docente;