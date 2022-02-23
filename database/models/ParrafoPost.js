const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class ParrafoPost extends Model {}
ParrafoPost.init({
    parrafo: DataTypes.TEXT,
    idPost: DataTypes.INTEGER
},{
    sequelize,
    modelName: "parrafoPost"
});
module.exports = ParrafoPost;