const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Aula = sequelize.define(
  "aula",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.TEXT,
    },
    edificio: {
      type: Sequelize.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Aula;

/*
class Aula {
  constructor(nombre, numero, edificio, capacidad, ubicacion, estado) {
    this.nombre = nombre;
    this.numero = numero;
    this.edificio = edificio;
    this.capacidad = capacidad;
    this.ubicacion = ubicacion;
    this.estado = estado;
    this.id++;
  }
}
module.exports = Aula;

Cada aula tiene:
nombre: aula o sala
numero: 57 / 58 / 7
edificio: bloque 2 / rectorado
capacidad: 30 / 70
ubicación: planta baja / 1er piso
estado: habiitado o no // TODO: esto es diferente de si está ocupada o no.
*/
