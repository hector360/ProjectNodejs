
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class ReservaAsiento extends Model {}
ReservaAsiento.init({
    identificador: DataTypes.STRING,
    id_tipo_asiento: DataTypes.INTEGER,
    reservado:  DataTypes.BOOLEAN,
    id_usuario_personalizado: DataTypes.STRING,
},{
    sequelize,
    modelName: "reserva_asiento"
});
module.exports = ReservaAsiento;

