const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const ReservaMateria = sequelize.define(
    "reservamateria",
    {
        idReserva: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'reserva',
                key: 'id',
            }
        },
        codMateria: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'materia',
                key: 'cod',
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
module.exports = ReservaMateria;
