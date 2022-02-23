
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class RegistroES extends Model {}
RegistroES.init({
    entrada: DataTypes.DATE,
    salida:  DataTypes.DATE,
    id_usuario_personalizado: DataTypes.STRING,
    sku_membresia:  DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    codigo_brazalete: DataTypes.STRING,
},{
    sequelize,
    modelName: "registroES"
});
module.exports = RegistroES;

