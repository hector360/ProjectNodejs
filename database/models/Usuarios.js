const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Usuario extends Model {}
Usuario.init({
    email: DataTypes.STRING,
    celular: DataTypes.STRING,
    nombres: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    password: DataTypes.STRING,
    idTipoUsuario: DataTypes.INTEGER,
    idUsuarioPersonalizado: DataTypes.STRING,
    calle: DataTypes.STRING,
    numero_int: DataTypes.INTEGER,
    referencia: DataTypes.STRING,
    colonia: DataTypes.STRING,
    codigo_postal: DataTypes.INTEGER,
    ciudad: DataTypes.STRING,
    estado: DataTypes.STRING,
    customerId: DataTypes.STRING,
},{
    sequelize,
    modelName: "usuario"
});


module.exports = Usuario;