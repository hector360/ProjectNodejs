
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Brazalete extends Model {}
Brazalete.init({
    codigo_brazalete: DataTypes.STRING,
    estado: DataTypes.STRING,
    urlqr: DataTypes.STRING,
},{
    sequelize,
    modelName: "brazalete"
});


module.exports = Brazalete;