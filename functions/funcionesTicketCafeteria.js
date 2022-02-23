const TicketCafeteriaProductos = require('../database/models/TicketCafeteriaProductos');
const CafeteriaProductos = require('../database/models/CafeteriaProductos');

async function findCafeteriaProducto(slug){
    console.log("buscaremos el prod de la cafe")
    return await CafeteriaProductos.findOne({
        where: {
            slug: slug
        }
    }).then(cafeProd =>{
        return cafeProd;
    }).catch(error => console.log(error))
}
async function createTicketCafeteria(data){
    return await TicketCafeteriaProductos.create(data)
        .then(ticketCafeteria => {
            return ticketCafeteria;
        }).catch(error => console.log(error))
}

module.exports = {
    findCafeteriaProducto,
    createTicketCafeteria
}