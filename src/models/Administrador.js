const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Administrador = sequelize.define(
    "administrador",
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
module.exports = Administrador;