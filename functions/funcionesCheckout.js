const BancoHoras = require("../database/models/BancoHoras")

function getDeudasHoras(id_user){
    return BancoHoras.findAll({
        where: {
            id_user: id_user,
            
        }
    }).then(bancoHoras => bancoHoras)
    .catch(error => {
        console.log(error);
    })
}

module.exports = {
    getDeudasHoras
}