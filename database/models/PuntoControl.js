
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class PuntoControl extends Model {}
PuntoControl.init({
    nombre: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    url_punto_control: DataTypes.STRING,
    valor_resta: DataTypes.STRING,

},{
    sequelize,
    modelName: "punto_control"
});


module.exports = PuntoControl;