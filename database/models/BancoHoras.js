
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class BancoHoras extends Model {}
BancoHoras.init({

    id_user: DataTypes.STRING,
    total_horas: DataTypes.INTEGER,
    horas_restantes: DataTypes.INTEGER,
    sku_membresia: DataTypes.STRING,
    horas_extra: DataTypes.INTEGER,
    deuda_horas: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
},{
    sequelize,
    modelName: "banco_horas"
});
module.exports = BancoHoras;

