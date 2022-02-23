
const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class TarjetasDigitales extends Model {}
TarjetasDigitales.init({

    tarjeta_code: DataTypes.STRING,
    total_horas: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    id_user_reclamo: DataTypes.INTEGER,
    reclamada: DataTypes.INTEGER,
    id_nino_membresia: DataTypes.INTEGER,
    horas_restantes: DataTypes.INTEGER,
},{
    sequelize,
    modelName: "tarjetasDigitales"
});



module.exports = TarjetasDigitales;