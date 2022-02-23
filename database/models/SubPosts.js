const { Model, DataTypes } = require('sequelize');
const ParrafoSubPost = require('./ParrafoSubPosts');

const sequelize = require('../db');

class SubPosts extends Model {}
SubPosts.init({
    // parrafo: DataTypes.STRING,
    subtitulo: DataTypes.STRING,
    urlImagenPost: DataTypes.STRING,
    idPost: DataTypes.INTEGER
},{
    sequelize,
    modelName: "subPosts"
});

SubPosts.hasMany(ParrafoSubPost, { foreignKey: 'idSubPosts' });
ParrafoSubPost.belongsTo(SubPosts, { foreignKey: 'idSubPosts' });
module.exports = SubPosts;