const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const comentarioDocente = sequelize.define(
    "comentariodocente",
    {
        comentarioId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'comentario',
                key: 'id',
            }
        },
        docenteId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'docente',
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
module.exports = comentarioDocente;