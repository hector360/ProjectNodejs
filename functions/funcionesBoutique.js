const Producto = require('../database/models/Producto');

async function getProductosBoutique(tipoProducto){
    return await Producto.findAll({
        where: {
            idTipoProducto: tipoProducto,
        }
    }).then(productos => {
        return productos;
    }).catch(error => {
        console.log(error);
    })

}
module.exports = {
    getProductosBoutique
}