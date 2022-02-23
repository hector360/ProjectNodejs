const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Carrito extends Model {}
Carrito.init({
    idProducto: DataTypes.INTEGER,
    nombreProducto: DataTypes.STRING,
    urlImagen: DataTypes.STRING,
    precioProducto: DataTypes.FLOAT,
    idUsuario: DataTypes.STRING,
    cantidad: DataTypes.INTEGER,
    idColor: DataTypes.INTEGER,
    idTalla: DataTypes.INTEGER,
    childName: DataTypes.STRING,
    horas: DataTypes.INTEGER,
    showDetalle: DataTypes.TEXT,
    horaCumpleanios: DataTypes.STRING,
    fechaCumpleanios: DataTypes.STRING,
    tipoCarrito: {
        type: DataTypes.STRING,
        defaultValue: "undefined"
    },
},{
    sequelize,
    modelName: "carrito"
});
module.exports = Carrito;

