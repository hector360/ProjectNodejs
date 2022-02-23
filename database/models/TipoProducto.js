
    const { Model, DataTypes } = require('sequelize');
    const sequelize = require('../db');
    
    class TipoProducto extends Model {}
    TipoProducto.init({
        nombre: DataTypes.STRING,
        urlImagenPost: DataTypes.STRING,
        descripcion: DataTypes.STRING,
        urlTipoProducto: DataTypes.STRING,
    },{
        sequelize,
        modelName: "tipoProducto"
    });
    module.exports = TipoProducto;