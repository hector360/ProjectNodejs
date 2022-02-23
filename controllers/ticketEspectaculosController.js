const TicketEspectaculos = require('../database/models/TicketEspectaculos')
const TicketCafeteriaProductos = require('../database/models/TicketCafeteriaProductos')
const funcionesTicket = require('../functions/funcionesTicket');
const funcionesUsuario = require('../functions/funcionesUsuarios');
const funcionesTicketEspectaculos = require('../functions/funcionesTicketEspectaculos');
const funcionesEspectaculos = require('../functions/funcionesEspectaculos');
const funcionesTicketCafeteria = require('../functions/funcionesTicketCafeteria');
const funcionesGenerador = require('../functions/funcionesGenerador');
const envConfig = require("../config.js");
const stripe = require('stripe')(envConfig.env == "dev" ? envConfig.stripe.private_developer_key : envConfig.stripe.private_production_key);
// const stripe = require('stripe')('clave');
const URLMAGICCRM = require('../variableGlobal/config');
const URLMAGIC = URLMAGICCRM.URLMAGICCRM;
const URLCRMDEV = URLMAGICCRM.URLCRMDEV;



exports.createTicketEspectaculo = async (req,res,next)=>{
    console.log("URLMAGIC: ")
    console.log(URLMAGIC)
    
    var asiento_adultos_r = req.body.asiento_adultos_r;
    var asiento_ninos_r = req.body.asiento_ninos_r;
    var asiento_ninos_v = req.body.asiento_ninos_v;
    var mesa_vip = req.body.mesa_vip;

    var arrayPaquete = req.body.arrayPaquete; //NO SE USA HDP
    var nuevoPrecio = req.body.total_precio_espectaculos * 100;
    var userData = {
        nombre_user: req.body.nombre_user,
        apellidos_user: req.body.apellidos_user,
        email_user: req.body.email_user,
        numero_user: req.body.numero_user,
    }
    return await funcionesUsuario.encontrarOCrearUsuario(userData)
        .then(async usuario => {
            console.log("req.body.fecha_espectaculo")
            console.log(req.body.fecha_espectaculo)
            console.log("req.body.hora_espectaculo")
            console.log(req.body.hora_espectaculo)
            var randomN = await funcionesGenerador.windowGuid();
            var ticketData = {
                customerTicketId: "",
                usuarioId: usuario.id,
                statusTicket: "NoReclamado",
                monto: req.body.total_precio_espectaculos,
                estado: "no-liquidado",
                idTicketSecret: randomN
        
            }
            return await funcionesTicket.createTicket(ticketData)
                .then(async ticket => {
                    return await funcionesEspectaculos.getDatosEspectaculo(req.body.slug)
                        .then(async espectaculos => {
                            console.log(req.body)
                            console.log("URLMAGIC: ")
                            console.log(URLMAGIC)
                            var idTicketProdSecret = await funcionesGenerador.windowGuid();
                            if(asiento_adultos_r > 0){
                                var idTicketProdSecret2 = await funcionesGenerador.windowGuid();
                                var ticketExtra = await funcionesTicketEspectaculos.createTicketEspectaculo({
                                    id_ticket: ticket.id,
                                    id_espectaculo: espectaculos.id,
                                    cantidad: asiento_adultos_r,
                                    precio_unitario: 260,
                                    idTicketProdSecret: idTicketProdSecret2,
                                    asiento_adultos_r: true,
                                    asiento_ninos_r: false,
                                    asiento_ninos_v: false,
                                    mesa_vip: false,
                                    fecha_espectaculo: req.body.fecha_espectaculo,
                                    hora_espectaculo: req.body.hora_espectaculo
                                })
                            }
                            if(asiento_ninos_r > 0){
                                var idTicketProdSecret3 = await funcionesGenerador.windowGuid();
                                var ticketExtra = await funcionesTicketEspectaculos.createTicketEspectaculo({
                                    id_ticket: ticket.id,
                                    id_espectaculo: espectaculos.id,
                                    cantidad: asiento_ninos_r,
                                    precio_unitario: 260,
                                    idTicketProdSecret: idTicketProdSecret3,
                                    asiento_adultos_r: false,
                                    asiento_ninos_r: true,
                                    asiento_ninos_v: false,
                                    mesa_vip: false,
                                    fecha_espectaculo: req.body.fecha_espectaculo,
                                    hora_espectaculo: req.body.hora_espectaculo
                                })
                            }
                            if(asiento_ninos_v > 0){
                                var idTicketProdSecret4 = await funcionesGenerador.windowGuid();
                                var ticketExtra = await funcionesTicketEspectaculos.createTicketEspectaculo({
                                    id_ticket: ticket.id,
                                    id_espectaculo: espectaculos.id,
                                    cantidad: asiento_ninos_v,
                                    precio_unitario: 310,
                                    idTicketProdSecret: idTicketProdSecret4,
                                    asiento_adultos_r: false,
                                    asiento_ninos_r: false,
                                    asiento_ninos_v: true,
                                    mesa_vip: false,
                                    fecha_espectaculo: req.body.fecha_espectaculo,
                                    hora_espectaculo: req.body.hora_espectaculo
                                })
                            }
                            if(mesa_vip > 0){
                                var idTicketProdSecret5 = await funcionesGenerador.windowGuid();
                                var ticketExtra = await funcionesTicketEspectaculos.createTicketEspectaculo({
                                    id_ticket: ticket.id,
                                    id_espectaculo: espectaculos.id,
                                    cantidad: mesa_vip,
                                    precio_unitario: 1200,
                                    idTicketProdSecret: idTicketProdSecret5,
                                    asiento_adultos_r: false,
                                    asiento_ninos_r: false,
                                    asiento_ninos_v: false,
                                    mesa_vip: true,
                                    fecha_espectaculo: req.body.fecha_espectaculo,
                                    hora_espectaculo: req.body.hora_espectaculo
                                })
                            }
                            
                            if(req.body.combo_rex > 0){
                                var idTicketProdSecret6 = await funcionesGenerador.windowGuid();
                                var cafeProd = await funcionesTicketCafeteria.findCafeteriaProducto("combo-rex");
                                var datosCafeteria = {
                                    id_ticket: ticket.id,
                                    id_producto_cafeteria: cafeProd.id,
                                    cantidad: req.body.combo_rex,
                                    precio_unitario: cafeProd.precio,
                                    idTicketProdSecret: idTicketProdSecret6
                                }
                                var ticketCafeCreado = await funcionesTicketCafeteria.createTicketCafeteria(datosCafeteria);
                            }
                            if(req.body.combo_pony > 0){
                                var idTicketProdSecret6 = await funcionesGenerador.windowGuid();
                                var cafeProd = await funcionesTicketCafeteria.findCafeteriaProducto("combo-pony");
                                var datosCafeteria = {
                                    id_ticket: ticket.id,
                                    id_producto_cafeteria: cafeProd.id,
                                    cantidad: req.body.combo_pony,
                                    precio_unitario: cafeProd.precio,
                                    idTicketProdSecret: idTicketProdSecret6
                                }
                                var ticketCafeCreado = await funcionesTicketCafeteria.createTicketCafeteria(datosCafeteria);
                            }
                            if(req.body.combo_heroes > 0){
                                var idTicketProdSecret6 = await funcionesGenerador.windowGuid();
                                var cafeProd = await funcionesTicketCafeteria.findCafeteriaProducto("combo-super-heroes");
                                var datosCafeteria = {
                                    id_ticket: ticket.id,
                                    id_producto_cafeteria: cafeProd.id,
                                    cantidad: req.body.combo_heroes,
                                    precio_unitario: cafeProd.precio,
                                    idTicketProdSecret: idTicketProdSecret6
                                }
                                var ticketCafeCreado = await funcionesTicketCafeteria.createTicketCafeteria(datosCafeteria);
                            }
                            
                            console.log(usuario.id)
                            console.log("ticket.id: ")
                            console.log(ticket.id)
                            console.log("espectaculos.nombre: ")
                            console.log(espectaculos.nombre)
                            console.log("espectaculos.urlImagenPost: ")
                            console.log(espectaculos.urlImagenPost)
                            console.log("nuevoPrecio: ")
                            console.log(nuevoPrecio)
                            var imagenProd = URLCRMDEV+espectaculos.urlImagenPost;
                            console.log("imagenProd: ")
                            console.log(imagenProd)
                            const session = await stripe.checkout.sessions.create({
                                payment_method_types: ['card'],
                                metadata: {
                                    usuarioId: usuario.id,
                                    id_ticket: ticket.id,
                                    idTipoProducto: "espectaculos-ticket",
                                    
                                },
                                line_items: [
                                  {
                                    price_data: {
                                      currency: 'mxn',
                                      product_data: {
                                        name: espectaculos.nombre,
                                        images: [`${imagenProd}`],
                                      },
                                      unit_amount: nuevoPrecio,
                                    },
                                    quantity: 1,
                                  },
                                ],
                                mode: 'payment',
                                success_url: `${URLMAGIC}/ticket-espectaculo?id=${ticket.idTicketSecret}`,
                                cancel_url: `${URLMAGIC}/shows-pasarela?id=${req.body.slug}`,
                              });
                              console.log({ id: session.id })
                              res.json({ id: session.id });

                            
                        }).catch(error => console.log(error))
                }).catch(error => {
                    console.log(error)
                })
        }).catch(error => {
            console.log(error)
        })
    

}

exports.getTicketEspectaculoData = async (req,res,next)=>{
    console.log(req.params.ticketId);
    var ticketsE = await funcionesTicketEspectaculos.getTicketEspectaculo(req.params.ticketId);
    res.json(ticketsE);
}