const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const ReservaAdmin = require("ReservaAdmin.js");
const Administrador = require("Administrador.js");
const Reserva = sequelize.define(
    "reserva",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        dia: {
            type: Sequelize.ENUM,
            values: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
        },
        horaInicio: {
            type: Sequelize.INTEGER,
        },
        horaFin: {
            type: Sequelize.INTEGER,
        },
        estado: {
            type: Sequalize.ENUM,
            value: ['AUTORIZADA', 'PENDIENTE', 'FINALIZADA', 'RECHAZADA'],    
        },
        idAula: {
            type: Sequelize.INTEGER,
            references: {
                model: 'aulas',
                key: 'id',
            } 
        },
        idDocente: {
            type: Sequelize.INTEGER,
            references: {
                model: 'docente',
                key: 'id',
            } 
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
Reserva.belongsToMany(Administrador, { through: ReservaAdmin});

module.exports = Reserva;
