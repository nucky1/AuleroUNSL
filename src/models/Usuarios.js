const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Docente = require("./Docente.js");
const Administrador = require("./Administrador.js");
const Usuario = sequelize.define(
    "usuarios",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement : true,
            primaryKey: true,
        },
        username: {
            type: Sequelize.TEXT,
        },
        password: {
            type: Sequelize.TEXT,
        },
        tipo: {
            type: Sequelize.TEXT,
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
Usuario.hasMany(Docente);
Usuario.hasMany(Administrador);
module.exports = Usuario;