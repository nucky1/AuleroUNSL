const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const ReservaAdmin = require("./ReservaAdmin.js");
const Docente = require("./Docente.js");
const Administrador = require("./Administrador.js");
const Reserva = sequelize.define(
    "reserva",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        dia: {
            type: Sequelize.ENUM(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'])
        },
        horaInicio: {
            type: Sequelize.INTEGER,
        },
        horaFin: {
            type: Sequelize.INTEGER,
        },
        periodo: {
            type: Sequelize.ENUM(['primer cuatrimestre', 'segundo cuatrimestre', 'anual']),
        },
        estado: {
            type: Sequelize.ENUM(['AUTORIZADA', 'PENDIENTE', 'FINALIZADA', 'RECHAZADA'])
        },
        aulaId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'aulas',
                key: 'id',
            } 
        },
        docenteId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'docente',
                key: 'id',
            } 
        },
        state: {
            type: Sequelize.ENUM(['ACTIVO', 'INACTIVO', 'BAJA'])
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
Reserva.belongsToMany(Administrador, { through: ReservaAdmin });
Administrador.belongsToMany(Reserva, { through: ReservaAdmin });
Reserva.belongsTo(Docente);
Docente.hasMany(Reserva);
module.exports = Reserva;
