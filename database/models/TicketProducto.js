const { Model, DataTypes } = require("sequelize");
const Producto = require('./Producto');
const sequelize = require("../db");

class TicketProducto extends Model {}

TicketProducto.init(
  {
    id_ticket: DataTypes.INTEGER,
    id_producto: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    precio_unitario: DataTypes.DOUBLE,
    idTicketProdSecret: DataTypes.STRING,
    idTalla: DataTypes.INTEGER,
    idColor: DataTypes.INTEGER
  },
  {
    sequelize,
    modelName: "ticket_producto",
  }
);



module.exports = TicketProducto;