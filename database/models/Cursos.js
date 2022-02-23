
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Cursos extends Model {}
Cursos.init({
    nombre: DataTypes.STRING,
    horarioClaseEntrada: DataTypes.STRING,
    horarioClaseSalida: DataTypes.STRING,
    duracionCurso: DataTypes.INTEGER,
    unidadTiempo: DataTypes.STRING,
    fechaInicial: DataTypes.DATE,
    fechaTerminacion: DataTypes.DATE,
    descripcionCurso: DataTypes.STRING,
    idMaestro: DataTypes.INTEGER,
    rutaImagen: DataTypes.STRING,
},{
    sequelize,
    modelName: "cursos"
});
module.exports = Cursos;