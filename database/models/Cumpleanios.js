

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Cumpleanios extends Model {}
Cumpleanios.init({
    nombre_nino: DataTypes.STRING,
    id_usuario_p: DataTypes.STRING,
    fecha_cumpleanios: DataTypes.STRING,
    hora_cumpleanios: DataTypes.STRING,
    total_invitados: DataTypes.INTEGER,
    id_producto: DataTypes.INTEGER,
},{
    sequelize,
    modelName: "cumpleanios"
});
module.exports = Cumpleanios;
