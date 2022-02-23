
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class ParrafoSubPosts extends Model {}
ParrafoSubPosts.init({
    parrafo: DataTypes.STRING,
    idSubPosts: DataTypes.INTEGER
},{
    sequelize,
    modelName: "parrafoSubPosts"
});
module.exports = ParrafoSubPosts;