const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Calcetas extends Model {}
Calcetas.init({

    cantidad: DataTypes.INTEGER,
    idServicio: DataTypes.INTEGER,
    servicio: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    total: DataTypes.FLOAT,
},{
    sequelize,
    modelName: "calcetas"
});
module.exports = Calcetas;

