
const ProductoCafeteria = require('../database/models/CafeteriaProductos');

async function createProductoCafeteria(producto){
    return await ProductoCafeteria.create(producto)
        .then(producto => {
            return producto;
        })
}   

async function getProductosCE(tipoProducto){
    return await ProductoCafeteria.findAll({
        where: {
            tipoProducto: tipoProducto,
        }
    }).then(productos => {
        return productos; 
    })
}

module.exports = {
    createProductoCafeteria,
    getProductosCE
}