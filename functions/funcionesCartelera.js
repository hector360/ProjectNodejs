const Cartelera = require('../database/models/Cartelera');
const FechaCartelera = require('../database/models/FechaCartelera');

function getCartelera(idPost){
    console.log("idPost")
    console.log(idPost)
    return Cartelera.findAll({
        where:{
            idPost: idPost
        }
    }).then(cartelera =>{
        return cartelera
    })
}

function getFechaCartelera(idFecha){
    return FechaCartelera.findOne({
        where:{
            id: idFecha
        }
    }).then(fechaCartelera =>{
        return fechaCartelera
    })
}

module.exports = {
    getCartelera,
    getFechaCartelera
};