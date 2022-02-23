
    const { Model, DataTypes } = require('sequelize');
    const sequelize = require('../db');
    
    class Tags extends Model {}
    Tags.init({
	    nombre: DataTypes.STRING,
    	urlImagen: DataTypes.STRING,
    },{
        sequelize,
        modelName: "tags"
    });
    module.exports = Tags;