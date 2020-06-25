const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Reserva = require("./Reserva.js");
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
        usuarioId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'usuarios',
                key: 'id',
            }
        },
        dni: {
            type: Sequelize.INTEGER,
        },
        legajo: {
            type: Sequelize.TEXT,
        },
        state: {
            type: Sequelize.ENUM(['ACTIVO', 'INACTIVO', 'BAJA']),
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
module.exports = Docente;