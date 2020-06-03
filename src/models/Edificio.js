const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Aula = require("Aulas.js");
const Edificio = sequelize.define(
    "edificio",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        nombre: {
            type: Sequelize.TEXT,
        },
        direccion: {
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
Edificio.hasMany(Aula);
module.exports = Edificio;