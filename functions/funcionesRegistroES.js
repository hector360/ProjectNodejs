const RegistroES = require('../database/models/RegistroES');
const moment = require('moment');
const funcionesBanco = require('../functions/funcionesBancoHoras');
function getRegistroES(skuMembresia){
    return RegistroES.findOne({
        where: {
            sku_membresia: skuMembresia,
            status: 1
        }
    }).then(registroes => {
        return registroes;
    })
}
function getRegistroSalidaNull(){
    return RegistroES.findAll({
        where: {
            salida: null
        }
    }).then(registroes => {
        return registroes;
    })
}

function getRegistroConBrazalete(codigo_brazalete){
    return RegistroES.findOne({
        where: {
            codigo_brazalete: codigo_brazalete
        }
    }).then(registroes => {
        return registroes;
    })
}
function getRegistroConIdRegistro(id_registro){
    return RegistroES.findOne({
        where: {
            id: id_registro
        }
    }).then(registroes => {
        return registroes;
    })
}
function createRegistroES(fecha, idUsuarioP, skuMembresia, codigo_brazalete){
    
    return RegistroES.create({
        entrada: fecha,
        id_usuario_personalizado: idUsuarioP,
        sku_membresia: skuMembresia,
        status: 1,
        codigo_brazalete: codigo_brazalete,
      }).then(registroes => {
        return registroes;
      })
}


function createSalidaES(fecha, idRegistro){
    return RegistroES.update({
        salida: fecha,
        status: 0
    },{
        where: {
            id: idRegistro,
        },
    }).then(actualizado => {
        return actualizado;
    })

}
async function descontarBanco(entrada, salida, id_registro){
    console.log("aqui mostramos la entrada y la salida: ")
    console.log("Entrada: " + entrada)
    console.log("Salida: " + salida)
    await RegistroES.findOne({
        where: { 
            id: id_registro
        }
    })
        .then(registroES => {
            // var entrada = moment("2021-03-19 18:57:15");
            // // var salida = moment("2021-03-19 21:07:15");
            // var salida = moment("2021-03-20 03:59:15");
            var final = moment.duration(salida - entrada)
            final = final.toString()
            final = final.split("PT")

            console.log(final[1].search("H"))
            if(final[1].search("H") > 0){
                let horasObject = final[1].split("H");
                let horas = horasObject[0];
                console.log("horasObject: ", horasObject)
                let minutosObject = horasObject[1].split("M");
                let minutos = minutosObject[0];
                // console.log(minutosObject[0])
                let segundosObject = minutosObject[0].split("S");
                let segundos = segundosObject[0] 
                console.log("minutos: ",minutos)
                if(minutos >= 10){
                    var horaExtra = 1;
                }else{
                    var horaExtra = 0;
                }
                descontarHoras(horas, horaExtra, registroES.sku_membresia);
            }else{
                console.log("no hay horas")
                if(final[1].search("M") > 0){
                    let minutosObject = final[1].split("M");
                    // console.log("minutosObject")
                    // console.log(minutosObject)
                    let minutos = minutosObject[0];
                    let segundosObject = minutosObject[1].split("S");
                    let segundos = segundosObject[0] 
                    console.log(segundos)
                    descontarHoras(0, 1, registroES.sku_membresia);
                }else{
                    console.log("no hay minutos")
                    let segundosObject = final[1].split("S");
                    let segundos = segundosObject[0] 
                    console.log(segundos)
                    descontarHoras(0, 1, registroES.sku_membresia);
                }
            }
            res.json(final);
        }).catch(error => {
            console.log(error)
        })
}
async function descontarHoras(horas, horasExtra, sku_membresia){
    // var horasADescontar = 15;
    console.log("horas: ", parseInt(horas))
    console.log("horasExtra: ", horasExtra)
    var descuentoHT = parseInt(horas) + horasExtra;
    console.log("descuentoHT")
    console.log(descuentoHT)
    console.log(sku_membresia);
    var horasADescontar = descuentoHT;
    // console.log(registroES)
    var bancoUsuario = await funcionesBanco.getBancoHoras(sku_membresia);
    console.log(bancoUsuario)
    console.log(bancoUsuario.horas_restantes)
    if(bancoUsuario.horas_restantes > 0){
        // var horas_restantes = bancoUsuario.horas_restantes - descuentoHT;
        var horas_restantes = bancoUsuario.horas_restantes - horasADescontar;
        console.log(horas_restantes)
        if(horas_restantes < 0){
            console.log("por aqui 1")
            //aqui se actualizara las horas restantes
            await funcionesBanco.restarHorasRestantes(0, bancoUsuario.id)
            //---
            console.log("descontaremos las horas extra")
            horas_restantes = -horas_restantes;
            if(bancoUsuario.horas_extra > 0){
                console.log("tienes horas extra, se descontaran")
                horas_restantes = bancoUsuario.horas_extra - horas_restantes;
                
                console.log(horas_restantes);
                if(horas_restantes < 0){
                    
                    await funcionesBanco.restarHorasExtra(0, bancoUsuario.id);
                    //se aumentara la deuda por que las horas son mayores a lo que tienes en horas extra
                    horas_restantes = -horas_restantes;
                    await funcionesBanco.agregarDeuda(horas_restantes, bancoUsuario.id)
                }else{
                    console.log("se restaran las horas extra")
                    await funcionesBanco.restarHorasExtra(horas_restantes, bancoUsuario.id);
                }
            }else{
                
                console.log(horas_restantes)
                console.log("no te quedan horas extra se te aumentara la deuda")
                await funcionesBanco.agregarDeuda(horas_restantes, bancoUsuario.id)
            }
        }else{
            //se resto las horas a las horas restantes y todavia le quedan horas restantes,
            console.log("por aqui 2")
            await funcionesBanco.restarHorasRestantes(horas_restantes, bancoUsuario.id)
        }
    }else{
        console.log("no quedan horas restantes, se debe de restar horas extra")

        if(bancoUsuario.horas_extra > 0){
            console.log("tienes horas extra, se descontaran")
            var horas_restantes = bancoUsuario.horas_extra - horasADescontar;
            
            console.log(horas_restantes);
            if(horas_restantes < 0){
                
                await funcionesBanco.restarHorasExtra(0, bancoUsuario.id);
                //se aumentara la deuda por que las horas son mayores a lo que tienes en horas extra
                horas_restantes = -horas_restantes;
                await funcionesBanco.agregarDeuda(horas_restantes, bancoUsuario.id)
            }else{
                console.log("se restaran las horas extra")
                await funcionesBanco.restarHorasExtra(horas_restantes, bancoUsuario.id);
            }
        }else{
            
            console.log(horas_restantes)
            console.log("no te quedan horas extra se te aumentara la deuda")
            await funcionesBanco.agregarDeuda(horasADescontar, bancoUsuario.id)
        }
        

    }

}

// function createSalidaNoche(fecha){
//     return RegistroES.update({
//         salida: fecha,
//         status: 0
//     },{
//         where: {
//             salida: null,
//         },
//     }).then(actualizado => {
//         return actualizado;
//     })

// }

module.exports = {
    createRegistroES,
    getRegistroES,
    createSalidaES,
    getRegistroConBrazalete,
    getRegistroConIdRegistro,
    getRegistroSalidaNull,
    descontarBanco,
    descontarHoras
}