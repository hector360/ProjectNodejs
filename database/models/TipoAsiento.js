
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class TipoAsiento extends Model {}
TipoAsiento.init({
    nombre: DataTypes.STRING,
    slug: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
},{
    sequelize,
    modelName: "tipo_asiento"
});
module.exports = TipoAsiento;

