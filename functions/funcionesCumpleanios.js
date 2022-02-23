const Cumpleanios = require('../database/models/Cumpleanios');

async function createCumpleanios(data){
    await Cumpleanios.create({
        nombre_nino: data.nombre_nino,
        id_usuario_p:  data.id_usuario_p,
        fecha_cumpleanios: data.fecha_cumpleanios,
        hora_cumpleanios: data.hora_cumpleanios,
        total_invitados: data.total_invitados,
        id_producto: data.id_producto

    }).then(cumpleanios => cumpleanios)
    .catch(error => {
        console.log(error)
    })
}
async function verificarFecha(fechaCumpleanios, horaCumpleanios){
    return Cumpleanios.findOne({
        where: {
            fecha_cumpleanios: fechaCumpleanios,
            hora_cumpleanios: horaCumpleanios
        }
    }).then(cumpleanios => cumpleanios)
    .catch(error => {
        console.log(error);
    })
}

module.exports = {
    createCumpleanios,
    verificarFecha
}