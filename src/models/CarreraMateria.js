const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const CarreraMateria = sequelize.define(
    "carreramateria",
    {
        carreraId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'carrera',
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
module.exports = CarreraMateria;
