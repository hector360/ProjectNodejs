const funcionesProductos = require("../functions/funcionesProductos")
const funcionesTarjetasHoras = require('../functions/funcionesTarjetasHoras');
const funcionesUsuarios = require("../functions/funcionesUsuarios");
const funcionesNinos = require("../functions/funcionesNinos");
const funcionesBancoHoras = require('../functions/funcionesBancoHoras');
const funcionesGenerador = require('../functions/funcionesGenerador');
const funcionesCarrito = require('../functions/funcionesCarrito');

exports.getTarjetasHoras = async(req,res, next) => {
    var usuario = await funcionesUsuarios.getdataUsuario(req.params.id_usuarioP);

    var tarjetas_digitales = await funcionesTarjetasHoras.getTarjetasHoras(usuario.id);

    res.json(tarjetas_digitales);
}

exports.exchangeCode = async(req,res,next) => {
    var tarjetaHora = await funcionesTarjetasHoras.getTarjetaHoraFromCode(req.body.codigo_tarjeta)
    console.log(tarjetaHora)
    var respuesta;
    if(tarjetaHora != null){
        respuesta = {
            status: true,
            tarjetaHora,
        }
    }else{
        respuesta = {
            status: false,
            tarjetaHora,
        }
    }
    res.json(respuesta);
}

exports.vinculateHoras = async(req,res,next) =>{
    var arrayH = req.body.arrayH;
    var arrayN = req.body.arrayN;
    var id_user = req.body.id_user;
    console.log("arrayH")
    console.log(arrayH)
    console.log("arrayN")
    console.log(arrayN)
    
    var usuario = await funcionesUsuarios.getdataUsuario(id_user);
    var ninoMembresia = await funcionesNinos.findNinoMembresia(arrayN)
    var data = {
        id_user_reclamo: usuario.id,
        reclamada: 1,
        id_nino_membresia: ninoMembresia.id,
        tarjeta_code: arrayH
    }
    var tarjetaActualizada = await funcionesTarjetasHoras.actualizarTarjeta(data);

    var bancoHoras = await funcionesBancoHoras.getBancoHoras(arrayN); 
    var tarjetaHora = await funcionesTarjetasHoras.getTarjetaHoraFromCode(arrayH);
    var dt = new Date();
    var anio = dt.getYear();
    var valorRandom = await funcionesGenerador.windowGuid2();
    // var nuevoSku = "V-"+anio+valorRandom;
    if(bancoHoras == null){
        var data = {
            id_user: usuario.id,
            total_horas: 0,
            horas_restantes: 0,
            sku_membresia: arrayN,
            horas_extra: tarjetaHora.total_horas,
        }
        var bancoCreado = await funcionesBancoHoras.crearBancoHoras(data);
            console.log(bancoCreado)
                
    }else{
        var nuevaHoras = parseInt(tarjetaHora.total_horas) + parseInt(bancoHoras.horas_extra);
        var data = {
            horas: nuevaHoras,
            id_bancoHoras: bancoHoras.id
        }
        var bacoActualizado = await funcionesBancoHoras.actualizarBancoHoras(data);
    }
    console.log("bancoHoras")
    console.log(bancoHoras)
    // tarjeta.id_nino_membresia
    console.log(tarjetaActualizada)
    res.json(tarjetaActualizada)
}

exports.addTarjeta = async (req,res,next) => {
    console.log(req.body.tarjeta_code);
    console.log(req.body.id_usuarioP);
    var tarjetaDigital = await funcionesTarjetasHoras.getTarjetaHoraFromCode(req.body.tarjeta_code)
    var carrito = await funcionesCarrito.getCarritofromUsuarioId(req.body.id_usuarioP);
    var totalHorasCarro = 0;
    carrito.map(cart => {
        if(cart.idProducto == 65){
            totalHorasCarro += cart.horas;
        }
        
    })
    // console.log("tarjetaDigital.horas_restantes: ")
    // console.log(tarjetaDigital.horas_restantes)
    // console.log("totalHorasCarro")
    // console.log(totalHorasCarro)
    // var tarjetaHorasRestantes = tarjetaDigital.horas_restantes - totalHorasCarro;
    // if(tarjetaHorasRestantes <= 0){
    //     tarjetaHorasRestantes = 0;
    // }
    // console.log("tarjetaHorasRestantes")
    // console.log(tarjetaHorasRestantes)

}