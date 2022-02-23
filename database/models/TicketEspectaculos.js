
const { Model, DataTypes } = require("sequelize");
const Producto = require('./Producto');
const sequelize = require("../db");

class TicketEspectaculos extends Model {}

TicketEspectaculos.init(
  {
    id_ticket: DataTypes.INTEGER,
    id_espectaculo: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    precio_unitario: DataTypes.DOUBLE,
    idTicketProdSecret: DataTypes.STRING,
    asiento_adultos_r: DataTypes.BOOLEAN,
    asiento_ninos_r: DataTypes.BOOLEAN,
    asiento_ninos_v: DataTypes.BOOLEAN,
    mesa_vip: DataTypes.BOOLEAN,
    fecha_espectaculo: DataTypes.STRING,
    hora_espectaculo: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "ticket_espectaculos",
  }
);

module.exports = TicketEspectaculos;