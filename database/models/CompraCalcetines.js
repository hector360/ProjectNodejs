
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class CompraCalcetines extends Model {}
CompraCalcetines.init({

    idServicio: DataTypes.INTEGER,
    nombreServicio: DataTypes.STRING,
    descripcionServicio: DataTypes.STRING,
    precioServicio: DataTypes.FLOAT,
    tiempo: DataTypes.INTEGER,
    medidaTiempo: DataTypes.STRING,
    idTipoServicio: DataTypes.INTEGER,
    idUsuario: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER,
},{
    sequelize,
    modelName: "compraCalcetines"
});
module.exports = CompraCalcetines;
