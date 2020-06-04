const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const Reserva = require("./Reserva.js");
const Edificio = require("./Edificio.js");
const extra = sequelize.define(
    "extras",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        idAula: {
            type: Sequelize.INTEGER,
            references: {
                model: 'aulas',
                key: 'id',
            }
        },
        extras: {
            type: Sequelize.ENUM(['Pizarra', 'Proyector', 'Pizarron', 'Ventilador']),
        },
    });
const Aula = sequelize.define(
    "aulas",
    {
        id: {
            type: Sequelize.INTEGER,
            autoincrement: true,
            primaryKey: true,
        },
        nombre: {
            type: Sequelize.TEXT,
        },
        numero: {
            type: Sequelize.INTEGER,
        },
        edificioId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'edificio',
                key: 'id',
            } 
        },
        capacidad: {
            type: Sequelize.INTEGER,
        },
        ubicacion: {
            type: Sequelize.TEXT,
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
Aula.belongsTo(Edificio, { foreignKey: 'edificioid' });
Edificio.hasMany(Aula, { foreignKey: 'edificioid' });
Aula.hasMany(Reserva);
Reserva.belongsTo(Aula);
extra.hasMany(Aula);
Aula.belongsTo(extra);
module.exports = Aula;
