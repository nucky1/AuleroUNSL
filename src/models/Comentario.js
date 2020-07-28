const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Docente = require("./Docente.js");
const comentarioDocente = require("./comentarioDocente");
const Comentario = sequelize.define(
    "comentario",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        texto:{
            type: Sequelize.TEXT,
        },
        aulaId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'aulas',
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
Comentario.belongsToMany(Docente, { through: comentarioDocente });
Docente.belongsToMany(Comentario, { through: comentarioDocente });
module.exports = Comentario;