const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class TallaProduct extends Model {}
TallaProduct.init({
    talla: DataTypes.STRING,
    status: DataTypes.INTEGER
}, {
    sequelize,
    modelName: "talla_product"
});

module.exports = TallaProduct;