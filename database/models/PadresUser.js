

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class PadresUser extends Model {}
PadresUser.init({

    nombre: DataTypes.STRING,
    id_user: DataTypes.INTEGER,
    slug: DataTypes.STRING,
    status: DataTypes.INTEGER,
},{
    sequelize,
    modelName: "padres_user"
});
module.exports = PadresUser;
