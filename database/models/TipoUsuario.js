const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class TipoUsuario extends Model {}
TipoUsuario.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
},{
    sequelize,
    modelName: "tipoUsuario"
});
module.exports = TipoUsuario;