
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class VinculoBrazaletes extends Model {}
VinculoBrazaletes.init({
    codigo_brazalete: DataTypes.STRING,
    tipo_brazalete: DataTypes.STRING,
    sku_membresia: DataTypes.STRING,
    id_usuario_personalizado: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    tipoAdulto: DataTypes.STRING,
},{
    sequelize,
    modelName: "vinculoBrazaletes"
});


module.exports = VinculoBrazaletes;