const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const ReservaMateria = sequelize.define(
    "reservamateria",
    {
        reservaId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'reserva',
                key: 'id',
            }
        },
        materiaId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'materia',
                key: 'cod',
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
module.exports = ReservaMateria;
