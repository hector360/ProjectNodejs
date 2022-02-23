const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Producto extends Model {}
Producto.init({
    nombreProducto: DataTypes.STRING,
    urlImagenPost: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    precio: DataTypes.FLOAT,
    idTipoProducto: DataTypes.INTEGER,
    temporada: DataTypes.STRING,
    urlMercadoShop: DataTypes.STRING,
    slug: DataTypes.STRING,
    horasTotales: DataTypes.INTEGER,
    urlImagenMovil: DataTypes.STRING,
    precio_ninos: DataTypes.FLOAT,
},{
    sequelize,
    modelName: "producto"
});

module.exports = Producto;

