const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class CaracteristicasProducto extends Model {}
CaracteristicasProducto.init(
  {
    id_producto: DataTypes.INTEGER,
    id_talla: DataTypes.INTEGER,
    id_color: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "caracteristicas_producto",
  }
);

module.exports = CaracteristicasProducto;
