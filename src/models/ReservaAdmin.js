const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const ReservaAdmin = sequelize.define(
    "reservaadmin",
    {
        idReserva: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'reserva',
                key: 'id',
            }
        },
        idAdministrador: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'administrador',
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
module.exports = CarreraMateria;
