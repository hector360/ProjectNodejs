
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class AdultoUsers extends Model {}
AdultoUsers.init({
    nombres: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    id_user: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
},{
    sequelize,
    modelName: "adulto_users"
});
module.exports = AdultoUsers;
