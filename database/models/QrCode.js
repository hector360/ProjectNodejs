

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class QrCode extends Model {}
QrCode.init({
    idCurso: DataTypes.INTEGER,
    nombreCurso: DataTypes.STRING,
    idUsuario: DataTypes.INTEGER,
    iv: DataTypes.STRING,
    content: DataTypes.STRING,
},{
    sequelize,
    modelName: "qrcode"
});
module.exports = QrCode;