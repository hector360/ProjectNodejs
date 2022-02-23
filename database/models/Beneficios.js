const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class Beneficios extends Model {}

Beneficios.init(
  {
    beneficio: DataTypes.STRING,
    id_membresia: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "benneficios",
  }
);

module.exports = Beneficios;
