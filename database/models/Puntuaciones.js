


const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Puntuaciones extends Model {}
Puntuaciones.init({
    record: DataTypes.INTEGER,
    puntuacion: DataTypes.INTEGER,
    id_nino: DataTypes.INTEGER,
},{
    sequelize,
    modelName: "puntuaciones"
});


module.exports = Puntuaciones;