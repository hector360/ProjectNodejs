const moment = require('moment');
const funcionesVinculoBrazaletes = require('../functions/funcionesVinculoBrazaletes');
const funcionesRegistroES =require('../functions/funcionesRegistroES');
const funcionesBanco = require('../functions/funcionesBancoHoras');
const RegistroES = require('../database/models/RegistroES');
const funcionesCron = require('../functions/funcionesCron');

exports.asignarEntradaSalida = async(req,res,next)=>{
    console.log(req.body)
    console.log(moment().format())
    var fechaAhora = moment().format();
    //codigo brazalete: 73jdhe-7jdu38d-939dj38
    // res.json({
    //     codigo_brazalete: req.body.codigo_brazalete,
    //     fecha: moment().format()
    // })
    await funcionesVinculoBrazaletes.getVinculoBrazaletes(req.body.codigo_brazalete)
        .then(async vinculoBrazalete => {
        console.log(vinculoBrazalete)
        if(vinculoBrazalete == null){
            return res.json({mensaje: "Brazalete rechazado, no existe", access: false, out: false})
        }
        await funcionesRegistroES.getRegistroES(vinculoBrazalete.sku_membresia)
            .then(async hayRegistro => {
                
                if(hayRegistro == null){
                    console.log("no hay registro crearemos uno")
                    await funcionesRegistroES.getRegistroConBrazalete(vinculoBrazalete.codigo_brazalete)
                        .then(async brazaleteCaducado => {
                            if(brazaleteCaducado == null){
                                await funcionesBanco.getBancoHoras(vinculoBrazalete.sku_membresia)
                                    .then(async banco_horas => {
                                        if(banco_horas != null){
                                            if(banco_horas.horas_restantes > 0){
                                                console.log("nuevo brazalete se insertara el registro")
                                                await funcionesRegistroES.createRegistroES(fechaAhora, vinculoBrazalete.id_usuario_personalizado, vinculoBrazalete.sku_membresia, vinculoBrazalete.codigo_brazalete)
                                                    .then(registroES => {
                                                    res.json({registroES, access: true, out: false})
                                                }).catch(error => {
                                                    console.log("error al crear el registro ES")
                                                    console.log(error)
                                                })
                                            }else{
                                                if(banco_horas.horas_extra > 0){
                                                    console.log("no te quedan horas de membresia, utilizaremos tus horas extra")
                                                    await funcionesRegistroES.createRegistroES(fechaAhora, vinculoBrazalete.id_usuario_personalizado, vinculoBrazalete.sku_membresia, vinculoBrazalete.codigo_brazalete)
                                                    .then(registroES => {
                                                    res.json({registroES, access: true, out: false})
                                                    }).catch(error => {
                                                        console.log("error al crear el registro ES")
                                                        console.log(error)
                                                    })
                                                    // res.json({message: "no te quedan horas de membresia, utilizaremos tus horas extra", access: false, out: false})
                                                }else{
                                                    console.log("no te quedan horas ni horas extra")
                                                    res.json({message: "no te quedan horas ni horas extra", access: false, out: false})
                                                }
                                                
                                            }
                                            
                                        }else{
                                            console.log("no tienes banco de horas");
                                            res.json({message: "No tienes banco de horas", access: false, out: false})
                                        }
                                        
                                }).catch(error => {
                                    console.log(error)
                                })
                                
                            }else{
                                console.log("Este brazalete ya esta caducado, cambialo")
                                res.json({message: "Este brazalete ya esta caducado, cambialo", access: false, out: false})
                            }
                            
                        }).catch(error => {
                            console.log(error)
                        })
                    
                }else{
                    console.log("ya hay registro lo actualizaremos para la salida")
                    // console.log(hayRegistro.dataValues.id)
                    await funcionesRegistroES.createSalidaES(fechaAhora, hayRegistro.dataValues.id)
                        .then(async actualizado => {
                            
                            await funcionesRegistroES.getRegistroConIdRegistro(hayRegistro.dataValues.id)
                                .then(async registro => {
                                    // var breakfast = moment('8:32','HH:mm');
                                    // var lunch = moment('12:52','HH:mm');
                                    var breakfast = moment(registro.entrada);
                                    var lunch = moment(registro.salida);
                                    console.log( moment.duration(lunch - breakfast).humanize() + ' between meals' )
                                    console.log("registro")
                                    console.log(registro)
                                    await funcionesRegistroES.descontarBanco(registro.entrada, registro.salida, registro.id)
                                    res.json({registro, access: false, out: true})
                                })
                            
                        })
                }
            }).catch(error => {
                console.log(error)
            })
        
    
    }).catch(error => {
        console.log("error al conseguir el vinculo del brazalete")
        console.log(error)
    })
    
}

exports.pruebaMoment = async (req,res)=>{
    await RegistroES.findOne({
        where: { 
            id: 1
        }
    })
        .then(registroES => {
            var entrada = moment("2021-03-19 18:57:15");
            // var salida = moment("2021-03-19 21:07:15");
            var salida = moment("2021-03-20 03:59:15");
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
                funcionesRegistroES.descontarHoras(horas, horaExtra, registroES.sku_membresia);
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
                    funcionesRegistroES.descontarHoras(0, 1, registroES.sku_membresia);
                }else{
                    console.log("no hay minutos")
                    let segundosObject = final[1].split("S");
                    let segundos = segundosObject[0] 
                    console.log(segundos)
                    funcionesRegistroES.descontarHoras(0, 1, registroES.sku_membresia);
                }
            }
            res.json(final);
        }).catch(error => {
            console.log(error)
        })
}


exports.pruebaCron = async(req,res,next) => {
    var cierreMedia = await funcionesCron.cerrarRegistrosMediaNoche();
    console.log(cierreMedia);
    res.json(cierreMedia);
}
