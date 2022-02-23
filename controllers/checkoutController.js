const funcionesPadres = require("../functions/funcionesPadres")
const funcionesCheckout = require('../functions/funcionesCheckout');
const funcionesUsuarios = require("../functions/funcionesUsuarios");
const funcionesTicket = require('../functions/funcionesTicket');
const funcionesGenerador = require("../functions/funcionesGenerador");
const funcionesBancoHoras = require("../functions/funcionesBancoHoras");
const funcionesNinos = require("../functions/funcionesNinos");

exports.getDeudasHoras = async(req,res,next) => {
    var usuario = await funcionesUsuarios.getdataUsuario(req.params.id_usuarioP);
    var banco_horas = await funcionesCheckout.getDeudasHoras(usuario.id);
    console.log(banco_horas)
    res.json(banco_horas);
}

exports.getDeudasCuentaAbierta = async(req,res,next) => {
    var usuario = await funcionesUsuarios.getdataUsuario(req.params.id_usuarioP);
    var ticketCuentaAbierta = await funcionesTicket.traerTicketsCuentaAbierta(usuario.id)
    console.log(ticketCuentaAbierta)

    res.json(ticketCuentaAbierta);

}
exports.payCartDeuda = async(req,res,next) => {
    console.log(req.body.id_ticket)
    console.log(req.body.arrayTicketId)
    console.log(req.body.arraySkuBanco)
    console.log(req.body.usuarioId)
    console.log("req.body.arrayTicketId")
    console.log(req.body.arrayTicketId)
    if(req.body.arrayTicketId != undefined){
        req.body.arrayTicketId.map(arrayTicketId => {
            funcionesTicket.actualizarTicketAbierto(arrayTicketId.idTicketSecret ,req.body.id_ticket, "liquidado", 0);
        });
    }
    
    var usuario = await funcionesUsuarios.getdataUsuario(req.body.usuarioId);
    console.log("req.body.arraySkuBanco")
    console.log(req.body.arraySkuBanco)
    if(req.body.arraySkuBanco != undefined){
        req.body.arraySkuBanco.map(async arraySkuBanco => {
            var idTicketSecret = await funcionesGenerador.windowGuid2();
            var fecha = new Date();
            var year = fecha.getFullYear();
            idTicketSecret = `tp-${year}` + idTicketSecret;
            let monto = parseInt(arraySkuBanco.deuda_horas) * 130;
            var dataTicket = {
                customerTicketId: req.body.id_ticket,
                usuarioId: usuario.id,
                statusTicket: "NoReclamado",
                monto: monto,
                faltante: 0,
                estado: "liquidado",
                idTicketSecret: idTicketSecret,
                cuenta_abierta: 0,
    
            }
            var ticket = await funcionesTicket.createTicket(dataTicket)
            var idTicketSecret2 = await funcionesGenerador.windowGuid2();
            var fecha2 = new Date();
            var year2 = fecha2.getFullYear();
            idTicketSecret2 = `tp-${year2}` + idTicketSecret2;
            
            var dataTicketProducto = {
                id_ticket: ticket.id,
                id_producto: 65,
                cantidad: 1,
                precio_unitario: monto,
                idTicketProdSecret: idTicketSecret2,
                idTalla: 0,
                idColor: 0
            };
            var ticketProducto = funcionesTicket.createTicketProducto(dataTicketProducto)
    
            funcionesBancoHoras.actualizarDeuda(0, arraySkuBanco.sku_membresia)
    
        });
    }
    
    console.log("ticketActualizado")
    res.json("ticketActualizado");
}

exports.checarHorasMembresias = async(req,res,next) => {
    // console.log(req.params.id_usuarioP)
    var usuario = await funcionesUsuarios.getdataUsuario(req.params.id_usuarioP);
    var membresia = await funcionesNinos.getMembresiasFromUser(usuario.id)
    
    var arrayMembresia = [];
    for(var i = 0; i < membresia.length; i++){
        // if(m.ninos_membresia[0].sku_membresia)
        var identificador = membresia[i].ninos_membresia[0].sku_membresia.split("-");
        if(identificador[0] == "C"){
            var bancoHoras = await funcionesBancoHoras.getBancoHoras(membresia[i].ninos_membresia[0].sku_membresia)
            console.log("bancoHoras.deuda_horas")
            console.log(bancoHoras.horas_restantes)
            if(bancoHoras.horas_restantes > 0){
                arrayMembresia.push({
                    sku_membresia: membresia[i].ninos_membresia[0].sku_membresia,
                    horas_restantes: bancoHoras.horas_restantes
                })
            }   
            
        }
    }
    
    res.json(arrayMembresia);
}

exports.getHorasRestantes = async(req,res,next) => {
    
    var bancoHoras = await funcionesBancoHoras.getBancoHoras(req.params.sku_membresia)
    console.log(bancoHoras.horas_restantes);
    res.json(bancoHoras.horas_restantes);
}

exports.pagarDeudasPorMembresia = async(req,res,next) => {
    console.log(req.body.select_pagarDeudas)
    console.log(req.body.sku_membresia)
    console.log("req.body.deuda_horas")
    console.log(req.body.deuda_horas)
    console.log("req.body.horas_restantes")
    console.log(req.body.horas_restantes)
    var nuevaHorasRestantes = req.body.horas_restantes - req.body.deuda_horas;
    var nuevaHoraDeudas = req.body.deuda_horas - req.body.horas_restantes;
    if(nuevaHoraDeudas <= 0){
        nuevaHoraDeudas = 0;
    }
    if(nuevaHorasRestantes <= 0){
        // console.log("nuevaHorasRestantes")
        // console.log(nuevaHorasRestantes)
        nuevaHorasRestantes = 0
    }
    // console.log("nuevaHorasRestantes")
    // console.log(nuevaHorasRestantes)
    await funcionesBancoHoras.restarHorasRestantesFromSku(nuevaHorasRestantes, req.body.select_pagarDeudas)

    await funcionesBancoHoras.actualizarDeuda(nuevaHoraDeudas, req.body.sku_membresia);

    res.json({message: "Deuda Saldada", status: true});
    // funcionesCheckout.pagarDeudasPorMembresia()
    
}