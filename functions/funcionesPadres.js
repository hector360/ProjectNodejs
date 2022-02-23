const PadresUser = require('../database/models/PadresUser');

function getdataPadres(idPadres){
    return PadresUser.findOne({
        where: {
            id: idPadres
        }
    }).then(padresUser => {
        return padresUser.dataValues;
    })
}

function createPadreUser(data){
    return PadresUser.create({
        nombre: data.nombre,
        id_user: data.id_user,
        slug: data.slug,
        status: data.status
    }).then(async padresUser =>{
        return padresUser;
    }).catch(error => {
        console.log(error);
    })
}
module.exports = {
    getdataPadres,
    createPadreUser
}