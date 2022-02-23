const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Blog extends Model {}
Blog.init({

    idUsuario: DataTypes.INTEGER,
    nombreUsuario: DataTypes.STRING,
    correoUsuario: DataTypes.STRING,
    mensaje: DataTypes.STRING,
    idPost: DataTypes.INTEGER,
},{
    sequelize,
    modelName: "blog"
});
module.exports = Blog;

