const Producto = require('../database/models/Producto');
const Ticket = require('../database/models/Ticket');
const TicketProducto = require('../database/models/TicketProducto');

async function createTicket(data){
    return await Ticket.create(data)
        .then(ticket => ticket)
}

async function createTicketProducto(data){
  return await TicketProducto.create(data)
        .then(ticket => ticket)
        .catch(error => {
          console.log(error);
        })
}
async function actualizarTicket(datos){
    console.log("datos.customerTicketID")
    console.log(datos.customerTicketID)
    return await Ticket.update({
        customerTicketId: datos.customerTicketID,
        estado: "liquidado"
    }, {
        where: {
            id: datos.id_ticket
        }
    }).then(ticketActualizado => {
        return ticketActualizado;
    })
}
// async function traerTicketsCuentaAbierta(usuario_id){
//     return await Ticket.findAll({
//         where: {
//             cuenta_abierta: 1,
//             usuarioId: usuario_id
//         }
//     }).then(ticket => ticket)
//     .catch(error => {
//         console.log(error);
//     })
// }

async function traerTicketsCuentaAbierta(usuario_id){
    Ticket.hasMany(TicketProducto, { foreignKey: "id_ticket" });
    TicketProducto.belongsTo(Ticket, { foreignKey: "id_ticket" });
  
    // TicketProducto.hasMany(Producto, { foreignKey: "id_producto" });
    // Producto.belongsTo(TicketProducto, { foreignKey: "id_producto" });
    TicketProducto.belongsTo(Producto, { foreignKey: "id_producto" });
    Producto.hasMany(TicketProducto, { foreignKey: "id_producto" });
  
    // FechaCartelera.hasMany(Cartelera, { foreignKey: "idFechaCartelera" });
    // Cartelera.belongsTo(FechaCartelera, { foreignKey: "idFechaCartelera" });
  
    return await Ticket.findAll({
      include: [
        {
          model: TicketProducto,
          attributes: ["id", "precio_unitario", "cantidad", "idTicketProdSecret",],
          include: [
            {
              model: Producto,
              attributes: ["id", "nombreProducto", "urlImagenPost", "slug"],
            }
          ],
        },
      ],
      where: {
        cuenta_abierta: 1,
        usuarioId: usuario_id
    },
    }).then((ticket) => {
      return ticket;
    });
}
async function actualizarTicketAbierto(idTicketSecret ,id_ticket, estado, cuenta_abierta){
  
   return await Ticket.update({
      customerTicketId: id_ticket,
      estado: estado,
      cuenta_abierta: cuenta_abierta
    }, {
    where: {
      idTicketSecret: idTicketSecret
    },
  })
  .then(ticket => ticket)
  .catch(error => {
      console.log(error)
  })
}

module.exports = {
    createTicket,
    actualizarTicket,
    traerTicketsCuentaAbierta,
    actualizarTicketAbierto,
    createTicketProducto
}