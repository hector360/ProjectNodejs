const Brazalete = require('../database/models/Brazalete');
const VinculoBrazaletes = require('../database/models/VinculoBrazaletes');
const funcionesUsuarios = require('../functions/funcionesUsuarios');
const funcionesPadres = require('../functions/funcionesPadres');
const funcionesBrazalete = require('../functions/funcionesBrazaletes');

const ninos = require('../functions/ninos');
const funcionesVinculoBrazaletes = require('../functions/funcionesVinculoBrazaletes');
exports.crearBrazalete = async(req,res)=>{
    await Brazalete.create({
        codigo_brazalete: req.body.codigo_brazalete,
        estado: req.body.estado,
        urlqr: req.body.urlqr
    })
    .then(tag =>{
        res.redirect('/mostrarBrazaletes');
        // res.json(tag)
    })
    .catch(err => {
        // console.log(err)
    })
}
exports.getBrazaletes = async(req,res)=>{
    await Brazalete.findAll()
    .then(brazaletes =>{
        
        res.json(brazaletes)
    })
    .catch(err => {
        // console.log(err)
    })
}

exports.sumarServicio = async(req,res)=>{
    // await Brazalete.findAll()
    // .then(brazaletes =>{
        
    //     res.json(brazaletes)
    // })
    // .catch(err => console.log(err))
    
    // console.log(req.body);
    res.redirect("https://www.w3schools.com/howto/howto_js_redirect_webpage.asp")
}

exports.createVinculacion = async(req,res, next)=>{
    console.log(req.body)
    // codigo_brazalete: '',
    // tipoAdulto: 'adulto',
    // id_usuario_personalizado: 'c67ed2bf-937e-44a8-a609-d90a04fb9564',
    // tipo_brazalete: 'usuario-padre', 
    // identificadorPersona: '2'

    await VinculoBrazaletes.findOne({
        where: {
            sku_membresia: req.body.identificadorPersona,
            status: 1,
    }}).then(async vinculoB => {
        console.log(vinculoB)
        if(vinculoB == null){
            await funcionesBrazalete.createBrazalete(req.body.codigo_brazalete, "ocupado")
                .then(async brazalete => {
                    await funcionesVinculoBrazaletes.createVinculoBrazalete(brazalete.codigo_brazalete, req.body)
                        .then(vinculaBrazalete => {
                            console.log(vinculaBrazalete)
                            res.redirect(`/vincular-brazalete?id=${req.body.id_usuario_personalizado}`)
                            // return vinculaBrazalete;
                        }).catch(error => {
                            console.log(error)
                        })
                }).catch(error => {
                    console.log(error)
                })
            // await Brazalete.create({
            //     codigo_brazalete: req.body.codigo_brazalete,
            //     estado: "ocupado",
        
            // }).then(async brazalete =>{
                
            //     await VinculoBrazaletes.create({
            //         codigo_brazalete: brazalete.codigo_brazalete,
            //         tipo_brazalete: req.body.tipo_brazalete,
            //         sku_membresia: req.body.identificadorPersona,
            //         id_usuario_personalizado: req.body.id_usuario_personalizado,
            //         tipoAdulto: req.body.tipoAdulto,
            //         status: 1,
            //     }).then(vinculaBrazalete => {
            //         console.log(vinculaBrazalete)
            //         return vinculaBrazalete;
            //     }).catch(error => {
            //         console.log(error)
            //     })
            // }).catch(error => {
            //     console.log(error);
            // })
        }else{
            console.log("ya existe uno debes actualizar y crear uno nuevo")
            console.log(vinculoB.dataValues.id)
            await funcionesVinculoBrazaletes.actualizarVinculoBrazalete(vinculoB.dataValues.id)
                .then(async vb => {
                    console.log("se acabaaa de actualizar esta onda")
                    await funcionesBrazalete.createBrazalete(req.body.codigo_brazalete, "ocupado")
                    .then(async brazalete => {
                        await funcionesVinculoBrazaletes.createVinculoBrazalete(brazalete.codigo_brazalete, req.body)
                            .then(vinculaBrazalete => {
                                console.log(vinculaBrazalete)
                                res.redirect(`/vincular-brazalete?id=${req.body.id_usuario_personalizado}`)
                            }).catch(error => {
                                console.log(error)
                            })
                    }).catch(error => {
                        console.log(error)
                    })
                }).catch(error => {
                    console.log(error);
                })

            
        }
    });
    
    
}

exports.getVinculosBrazalete = async (req,res)=>{
    await VinculoBrazaletes.findAll({
        where: {
          id_usuario_personalizado: req.params.idUsuarioP,
          status: 1,
        }
    }).then(async vinculoBrazalete => {
        console.log("vinculoBrazalete")
        console.log(vinculoBrazalete)
        // res.json(vinculoBrazalete)
        var arrayVinculo = [];
        
        for(let i = 0; i< vinculoBrazalete.length; i++){
            console.log("vinculoBrazalete[i].id_usuario_personalizado")
            console.log(vinculoBrazalete[i].id_usuario_personalizado)
            if(vinculoBrazalete[i].tipo_brazalete == "usuario-principal"){
                var usuarioData = await funcionesUsuarios.getdataUsuario(vinculoBrazalete[i].sku_membresia);
            }else if(vinculoBrazalete[i].tipo_brazalete == "usuario-nino"){
                var usuarioData = await ninos.getdataNino(vinculoBrazalete[i].sku_membresia);
            }else if(vinculoBrazalete[i].tipo_brazalete == "usuario-padre"){
                var usuarioData = await funcionesPadres.getdataPadres(vinculoBrazalete[i].sku_membresia);
            }
            console.log("usuarioData")
            console.log(usuarioData)
            arrayVinculo.push({
                id: vinculoBrazalete[i].id,
                usuario: usuarioData,
                codigo_brazalete: vinculoBrazalete[i].codigo_brazalete
            
            });
        }
        console.log("arrayVinculo")
        console.log(arrayVinculo)
        res.json(arrayVinculo);
    }).catch(error => {
        console.log(error)
    })
    
}

exports.eliminarVinculo = async (req,res,next)=>{
    console.log(req.body.idVinculo)

      await VinculoBrazaletes.update({
          status: 0
        }, {
        where: {
          id: req.body.idVinculo
        },
      })
        .then(function (eliminado) {
            res.json(eliminado)
        }).catch(error => {
            console.log(error)
        })
}