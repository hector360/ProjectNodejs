const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Servicios extends Model {}
Servicios.init({

    // cantidad: DataTypes.INTEGER,
    // idServicio: DataTypes.INTEGER,
    // servicio: DataTypes.STRING,
    // precio: DataTypes.FLOAT,
    // total: DataTypes.FLOAT,
    nombreServicio: DataTypes.STRING,
    descripcionServicio: DataTypes.STRING,
    precioServicio: DataTypes.FLOAT,
    tiempo: DataTypes.INTEGER,
    medidaTiempo: DataTypes.STRING,
    idTipoServicio: DataTypes.INTEGER,
},{
    sequelize,
    modelName: "servicios"
});
module.exports = Servicios;

