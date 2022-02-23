const TarjetasDigitales = require("../database/models/TarjetasDigitales")

async function crearTarjetaDigital(codigoTarjeta, total_horas, user_id, id_user_reclamo, reclamada){
    return await TarjetasDigitales.create({
        tarjeta_code: codigoTarjeta,
        total_horas: total_horas,
        id_user: user_id,
        id_user_reclamo: id_user_reclamo,
        reclamada: reclamada,
        horas_restantes: total_horas
      }).then(tarjetaDigital => tarjetaDigital)
      .catch(error => {
          console.log(error)
      })
}
async function getTarjetasHoras(usuario_id){
    return await TarjetasDigitales.findAll({
        where: {
            id_user: usuario_id,
            reclamada: 0
        }
    }).then(tarjetas_digitales => tarjetas_digitales)
    .catch(error => {
        console.log(error);
    })
}

async function getTarjetaHoraFromCode(tarjeta_code){
    return await TarjetasDigitales.findOne({
        where: {
            tarjeta_code: tarjeta_code
        }
    }).then(tarjetas_digitales => tarjetas_digitales)
    .catch(error => {
        console.log(error);
    })
}

async function actualizarTarjeta(data){
    return await TarjetasDigitales.update({
        id_user_reclamo: data.id_user_reclamo,
        reclamada: data.reclamada,
        id_nino_membresia: data.id_nino_membresia,
    },{
        where: {
            tarjeta_code: data.tarjeta_code
        }
    }).then(tarjetas_digitales => tarjetas_digitales)
    .catch(error => {
        console.log(error);
    })
}
async function actualizarHorasRestantes(data){
    return await TarjetasDigitales.update({
        id_user_reclamo: data.id_user_reclamo,
        reclamada: data.reclamada,
        horas_restantes: data.horas_restantes,
    },{
        where: {
            tarjeta_code: data.tarjeta_code
        }
    }).then(tarjetas_digitales => tarjetas_digitales)
    .catch(error => {
        console.log(error);
    })
}

module.exports = {
    crearTarjetaDigital,
    getTarjetasHoras,
    getTarjetaHoraFromCode,
    actualizarTarjeta,
    actualizarHorasRestantes
}