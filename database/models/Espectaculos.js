const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class Espectaculos extends Model {}
Espectaculos.init(
  {
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    urlImagenPost: DataTypes.STRING,
    urlImagenMovil: DataTypes.STRING,
    slug: DataTypes.STRING,
    id_producto: DataTypes.INTEGER,
    asientos_vip: DataTypes.INTEGER,
    asientos_filas: DataTypes.INTEGER,
    asientos_mesas: DataTypes.INTEGER,
    mesas_vip: DataTypes.INTEGER,
    urlImagenMapa: DataTypes.STRING,
    precio_regular: DataTypes.FLOAT,
    precio_vip: DataTypes.FLOAT,
    precio_adicional: DataTypes.FLOAT,
    precio_mesa_vip: DataTypes.FLOAT,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "espectaculos",
  }
);
module.exports = Espectaculos;
