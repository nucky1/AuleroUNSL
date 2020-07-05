const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Reserva = require("./Reserva");
const Admin = require("./Administrador");
const ReservaAdmin = sequelize.define(
    "reservaadmin",
    {
        reservaId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'reserva',
                key: 'id',
            }
        },
        administradorId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'administrador',
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
module.exports = ReservaAdmin;