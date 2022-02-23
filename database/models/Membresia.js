const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Membresia extends Model {}
Membresia.init({
    id_producto: DataTypes.INTEGER,
    tipo_pago: DataTypes.STRING,
    titulo: DataTypes.STRING,
    incluye_info: DataTypes.STRING,
    terminos_condiciones: DataTypes.STRING,
    shows: DataTypes.INTEGER,
    horas_globales: DataTypes.INTEGER,
    fiesta: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    prefijo: DataTypes.STRING,
    total_dias: DataTypes.STRING,
},{
    sequelize,
    modelName: "membresia"
});
module.exports = Membresia;
