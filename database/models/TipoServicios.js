const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class TipoServicios extends Model {}
TipoServicios.init({

    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
},{
    sequelize,
    modelName: "tipoServicios"
});
module.exports = TipoServicios;

