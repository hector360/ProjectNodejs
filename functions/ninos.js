const NinosUser = require('../database/models/NinosUser');
const NinosMembresia = require('../database/models/NinosMembresia');
const Ticket = require('../database/models/Ticket');

async function crearNinosTablas(nombrenino,usuarioId,idMembresia,nuevoSku,idTicket, total_dias){
    
    return await NinosUser.create({
        nombre: nombrenino,
        id_user: usuarioId,
        horas_globales: 24,
        status: 0,

    }).then(async ninoUser => {
        var fecha_inicio = moment().format();
        var fecha_vencimiento = moment().add(total_dias, 'days').format();
    
        return await NinosMembresia.create({
            id_nino: ninoUser.dataValues.id,
            id_membresia: idMembresia,
            fecha_inicio: fecha_inicio,
            fecha_vencimiento: fecha_vencimiento,
            sku_membresia: nuevoSku,
            status: 0,
        }).then(async ninoMembresia => {
            //aqui se actualiza el ticket
            console.log("se creo correctamente el niño membresia")
            await Ticket.update({estado: "liquidado"}, {
                where: {
                  id: idTicket,
                },
              })
                .then(function (ticket) {
                  console.log("se actualizo el ticket")
                }).catch(error => {
                    console.log("error al actualizar el ticket");
                    console.log(error);
                })
            
        }).catch(error => {
            console.log("error al crear niño membresia")
            console.log(error)
        });
    }).catch(error => {
        console.log("fallo el niño user");
    });
}
async function getdataNino(identificadorPersona){
    console.log("identificadorPersona")
    console.log(identificadorPersona)
    var ninoMembresia = await getNinoMembresia(identificadorPersona);
    console.log(ninoMembresia);
    var ninoUser = await getNino(ninoMembresia.id_nino);
    return ninoUser;
}

function getNinoMembresia(identificadorPersona){
    return NinosMembresia.findOne({
        where: {
            sku_membresia: identificadorPersona
        }
    }).then(ninosMembresia => {
        return ninosMembresia;
    })
}
function getNino(idNino){
    return NinosUser.findOne({
        where: {
            id: idNino
        }
    }).then(ninoUser => {
        return ninoUser.dataValues;
    })
}


module.exports = {
    getdataNino,
    crearNinosTablas
}