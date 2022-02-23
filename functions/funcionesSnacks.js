const Producto = require('../database/models/Producto');

async function getProductosSnack(idTipoProducto){
    return await Producto.findAll({
        where: {
            idTipoProducto: idTipoProducto
        }
    }).then(producto => producto)
    .catch(error => {
        console.log(error);
    })
}

module.exports = {
    getProductosSnack
}