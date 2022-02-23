const Carrito = require("../database/models/Carrito");

async function getCarritofromId(carritoId){
    return await Carrito.findOne({
        where: {
            id: carritoId
        }
    }).then(carrito => {
        return carrito;
    });
}

async function getCarritofromUsuarioId(usuarioId){
    return await Carrito.findAll({
        where: {
            idUsuario: usuarioId
        }
    }).then(carrito => {
        return carrito;
    })
}

module.exports = {
    getCarritofromId,
    getCarritofromUsuarioId
}