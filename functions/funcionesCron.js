const funcionesRegistroES = require('../functions/funcionesRegistroES');
const moment = require('moment');

async function cerrarRegistrosMediaNoche(){
    var fechaAhora = moment().format();
    return await funcionesRegistroES.getRegistroSalidaNull()
    .then(async hayRegistro => {
        console.log("hayRegistro")
        // console.log(hayRegistro)
        // return hayRegistro;
        hayRegistro.map(async hr => {
            await funcionesRegistroES.createSalidaES(fechaAhora, hr.id)
            .then(async actualizado => {
                
                await funcionesRegistroES.getRegistroConIdRegistro(hr.id)
                    .then(async registro => {
                        var breakfast = moment(registro.entrada);
                        var lunch = moment(registro.salida);
                        console.log( moment.duration(lunch - breakfast).humanize() + ' between meals' )
                        console.log("registro")
                        console.log(registro)
                        await funcionesRegistroES.descontarBanco(registro.entrada, registro.salida, registro.id)
                        // res.json({registro, access: false, out: true})
                    })
                
            })
        });
        // return {registro, access: false, out: true}
        
    });
    
}
module.exports = {
    cerrarRegistrosMediaNoche
}