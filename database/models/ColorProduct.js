const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class ColorProduct extends Model {}
ColorProduct.init({
    color: DataTypes.STRING,
    status: DataTypes.INTEGER
}, {
    sequelize,
    modelName: "color_product"
});

module.exports = ColorProduct;