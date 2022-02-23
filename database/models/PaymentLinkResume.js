const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class PaymentLinkResume extends Model {}

PaymentLinkResume.init({
    concept: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    stripe_id: DataTypes.STRING,
    email: DataTypes.STRING
}, {
    sequelize,
    modelName: "payment_link_resume"
});

module.exports = PaymentLinkResume;