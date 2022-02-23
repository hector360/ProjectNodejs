

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class ImagenesEspectaculos extends Model {}
ImagenesEspectaculos.init({
    id_espectaculos: DataTypes.INTEGER,
    imagen_espectaculo: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
},{
    sequelize,
    modelName: "imagenes_espectaculos"
});
module.exports = ImagenesEspectaculos;