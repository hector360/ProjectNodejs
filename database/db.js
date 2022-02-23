const { Sequelize } = require('sequelize');
const  labase  = require('../config');


// const sequelize = new Sequelize(
//     database.database,
//     database.username,
//     database.password, {
//         host: database.host,
//         dialect: "mysql"
//     }
// );

const sequelize = new Sequelize(
    // envConfig.stripe.private_developer_key
    labase.env == "dev" ? labase.devdatabase.database : labase.database.database,
    labase.env == "dev" ? labase.devdatabase.username : labase.database.username,
    labase.env == "dev" ? labase.devdatabase.password : labase.database.password, {
        host: labase.env == "dev" ? labase.devdatabase.host : labase.database.host,
        dialect: "mysql"
    }
);
module.exports = sequelize;

