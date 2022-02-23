const Brazalete = require('../database/models/Brazalete'); 

function createBrazalete(codigo_brazalete, estado){
    return Brazalete.create({
        codigo_brazalete: codigo_brazalete,
        estado: estado,

    }).then(async brazalete =>{
        return brazalete
    })
}

module.exports = {
    createBrazalete
}