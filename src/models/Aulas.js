const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Reserva = require("./Reserva.js");
const Aula = sequelize.define(
    "aulas",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        nombre: {
            type: Sequelize.TEXT,
        },
        numero: {
            type: Sequelize.INTEGER,
        },
        idEdificio: {
            type: Sequelize.INTEGER,
            references: {
                model: 'edificio',
                key: 'id',
            } 
        },
        capacidad: {
            type: Sequelize.INTEGER,
        },
        extras: {
            type: Sequelize.ENUM,
            values: ['Pizarra', 'Proyector', 'Pizarron', 'Ventilador'],
        },
        ubicacion: {
            type: Sequelize.TEXT,
        },
        state: {
            type: Sequelize.ENUM,
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
Aula.hasMany(Reserva);
module.exports = Aula;
