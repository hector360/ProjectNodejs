

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class NinosMembresia extends Model {}
NinosMembresia.init({

    id_nino: DataTypes.INTEGER,
    id_membresia: DataTypes.INTEGER,
    fecha_inicio: DataTypes.STRING,
    fecha_vencimiento: DataTypes.STRING,
    sku_membresia: DataTypes.STRING,
    status: DataTypes.INTEGER,
},{
    sequelize,
    modelName: "ninos_membresia"
});
module.exports = NinosMembresia;
