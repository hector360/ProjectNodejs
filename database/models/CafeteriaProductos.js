
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class CafeteriaProductos extends Model {}
CafeteriaProductos.init({

    nombreProducto: DataTypes.STRING,
    urlImagenPost: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    slug: DataTypes.STRING,
    urlImagenMovil: DataTypes.STRING,
    tipoProducto: DataTypes.STRING,
},{
    sequelize,
    modelName: "cafeteria_productos"
});
module.exports = CafeteriaProductos;

