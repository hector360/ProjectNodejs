
const VinculoBrazaletes = require('../database/models/VinculoBrazaletes');

function getVinculoBrazaletes(codigo_brazalete){
    return VinculoBrazaletes.findOne({
        where: {
            codigo_brazalete: codigo_brazalete,
            status: 1,
        }
    }).then(vinculoBrazalete => {
        return vinculoBrazalete;
    })
}

function createVinculoBrazalete(codigo_brazalete, body){
    return VinculoBrazaletes.create({
        codigo_brazalete: codigo_brazalete,
        tipo_brazalete: body.tipo_brazalete,
        sku_membresia: body.identificadorPersona,
        id_usuario_personalizado: body.id_usuario_personalizado,
        tipoAdulto: body.tipoAdulto,
        status: 1,
    }).then(vinculaBrazalete => {
        return vinculaBrazalete
    })
}

function actualizarVinculoBrazalete(idVinculo){
    return VinculoBrazaletes.update({
        status: 0
    },{
        where:{
           id: idVinculo
        }
    }).then(vb => {
        return vb;
    });
}
module.exports = {
    getVinculoBrazaletes,
    createVinculoBrazalete,
    actualizarVinculoBrazalete
}