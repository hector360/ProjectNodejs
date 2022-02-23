
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class FechaCartelera extends Model {}
FechaCartelera.init({
    fechaDia: DataTypes.DATEONLY,
},{
    sequelize,
    modelName: "fechaCartelera"
});
module.exports = FechaCartelera;