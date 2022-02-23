
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class HorasEspectaculo extends Model {}
HorasEspectaculo.init({
    id_cartelera: DataTypes.INTEGER,
    fechaHoraEntrada: {
        type: DataTypes.TIME,
    },
    fechaHoraSalida: {
        type: DataTypes.TIME,
    },  
},{
    sequelize,
    modelName: "horas_espectaculo"
});
module.exports = HorasEspectaculo;