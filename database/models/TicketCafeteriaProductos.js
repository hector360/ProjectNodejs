
const { Model, DataTypes } = require("sequelize");
const Producto = require('./Producto');
const sequelize = require("../db");

class TicketCafeteriaProductos extends Model {}

TicketCafeteriaProductos.init(
  {
    id_ticket: DataTypes.INTEGER,
    id_producto_cafeteria: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
    precio_unitario: DataTypes.DOUBLE,
    idTicketProdSecret: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "ticket_cafeteria_productos",
  }
);



module.exports = TicketCafeteriaProductos;