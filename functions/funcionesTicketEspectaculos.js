const Ticket = require('../database/models/Ticket');
const TicketEspectaculo = require('../database/models/TicketEspectaculos');
const Usuario = require('../database/models/Usuarios');
const Espectaculos = require('../database/models/Espectaculos');

async function createTicketEspectaculo(datosEspectaculo){
    return await TicketEspectaculo.create(datosEspectaculo)
        .then(ticketEspectaculo => ticketEspectaculo)
}

async function getTicketEspectaculo(ticketSecret){
    return await Ticket.findOne({
        where: {
            idTicketSecret: ticketSecret
        }
    }).then(async ticket => {
        var usuario = await Usuario.findOne({
            where: {
                id: ticket.usuarioId
            }
        });
        return await TicketEspectaculo.findAll({
            where: {
                id_ticket: ticket.id
            }
        }).then(async ticketsEspectaculos => {
            
            var arrayTickets = [];
            for(var i = 0; i < ticketsEspectaculos.length; i++){
                var espectaculo = await Espectaculos.findOne({
                    where: {
                        id: ticketsEspectaculos[i].id_espectaculo
                    }
                });
                // console.log(ticketsEspectaculos[i].asiento_regular)
                if(ticketsEspectaculos[i].asiento_adultos_r > 0){
                    var tipoAsiento = "Asiento regular adultos"
                }
                if(ticketsEspectaculos[i].asiento_ninos_r > 0){
                    var tipoAsiento = "Asiento regular niños"
                }
                if(ticketsEspectaculos[i].asiento_ninos_v > 0){
                    var tipoAsiento = "Asiento VIP niños"
                }
                if(ticketsEspectaculos[i].mesa_vip > 0){
                    var tipoAsiento = "Mesa VIP"
                }
                
                arrayTickets.push({
                    "nombre_espectaculo": espectaculo.nombre,
                    "tipoAsiento": tipoAsiento,
                    "cantidad": ticketsEspectaculos[i].cantidad,
                    "fecha_espectaculo": ticketsEspectaculos[i].fecha_espectaculo,
                    "hora_espectaculo": ticketsEspectaculos[i].hora_espectaculo,
                    "total": ticket.monto
                })
            }
            return arrayTickets;
        })
    })
}
module.exports = {
    createTicketEspectaculo,
    getTicketEspectaculo
}