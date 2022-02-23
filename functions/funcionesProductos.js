const Producto = require('../database/models/Producto');

function getProducto(idProducto){
    return Producto.findOne({
        where: {
            id: idProducto
        }
    }).then(producto => {
        return producto;
    })
}
function getProductofromTipoProduct(idTipoProducto){
    return Producto.findAll({
        where: {
            idTipoProducto: idTipoProducto
        }
    }).then(producto => {
        return producto;
    }).catch(error => {
        console.log(error);
    })
}
function getProductoFromSlug(slug){
    return Producto.findOne({
        where: {
            slug: slug
        }
    }).then(producto => producto)
    .catch(error => {
        console.log(error);
    })
}
function getProductoFromTipoProducto(idTipoProducto){
    return Producto.findAll({
        where: {
            idTipoProducto: idTipoProducto
        }
    }).then(productos => productos)
    .catch(error => {
        console.log(error);
    })
}


module.exports = {
    getProducto,
    getProductofromTipoProduct,
    getProductoFromSlug,
    getProductoFromTipoProducto
}