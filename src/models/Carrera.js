const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Facultad = require("./Facultad.js");
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
        facultadId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Facultad',
                key: 'id',
            }
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
Facultad.hasMany(carrera);
Carrera.belongsTo(Facultad);

module.exports = Carrera;