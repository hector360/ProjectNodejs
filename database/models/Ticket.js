const { Model, DataTypes } = require('sequelize');
const Usuarios = require('./Usuarios');
const TicketProducto = require('./TicketProducto');

const sequelize = require('../db');

class Ticket extends Model {}
Ticket.init({
    customerTicketId: DataTypes.STRING,
    usuarioId: DataTypes.INTEGER,
    statusTicket: DataTypes.STRING,
    monto: DataTypes.FLOAT,
    faltante: DataTypes.FLOAT,
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    estado: DataTypes.STRING,
    idTicketSecret: DataTypes.STRING,
    cuenta_abierta: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
},{
    sequelize,
    modelName: "ticket"
});



module.exports = Ticket;