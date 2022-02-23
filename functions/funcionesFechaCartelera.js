const FechaCartelera = require('../database/models/FechaCartelera');
const HorasEspectaculo = require('../database/models/HorasEspectaculo');

async function getFechaCartelera(idFechaCartelera){
    return await FechaCartelera.findOne({
        where: {
            id: idFechaCartelera
        }
    }).then(fecha_cartelera => fecha_cartelera)
}

async function getHoras(id_cartelera){
    return await HorasEspectaculo.findAll({
        where: {
            id_cartelera: id_cartelera
        }
    }).then(horas => horas)
}
module.exports = {
    getFechaCartelera,
    getHoras
}