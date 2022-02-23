
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class NinosUser extends Model {}
NinosUser.init({

    nombre: DataTypes.STRING,
    id_user: DataTypes.INTEGER,
    horas_globales: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
},{
    sequelize,
    modelName: "ninos_user"
});
module.exports = NinosUser;
