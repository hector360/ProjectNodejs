
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Cartelera extends Model {}
Cartelera.init({
    idPost: DataTypes.INTEGER,
    idFechaCartelera: DataTypes.INTEGER,
    id_espectaculos: DataTypes.INTEGER,
    // fechaDia: DataTypes.DATEONLY,
    fechaHoraEntrada: {
        type: DataTypes.TIME,
    },
    fechaHoraSalida: {
        type: DataTypes.TIME,
    },  
    status: DataTypes.BOOLEAN,
},{
    sequelize,
    modelName: "cartelera"
});
module.exports = Cartelera;