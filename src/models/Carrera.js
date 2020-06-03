const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Carrera = sequelize.define(
    "carrera",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        nombre: {
            type: Sequelize.TEXT,
        },
        idFacultad: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Facultad',
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
module.exports = Carrera;