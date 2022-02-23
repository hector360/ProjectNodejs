
const Servicios = require('../database/models/Servicios');
const TipoServicios = require('../database/models/TipoServicios');
const CompraCalcetines = require('../database/models/CompraCalcetines');

exports.createServicios = async(req,res)=>{
    await Servicios.create({

        nombreServicio: req.body.nombreServicio,
        precioServicio: req.body.precioServicio,
        descripcionServicio: req.body.descripcionServicio,
        tiempo: req.body.tiempo,
        medidaTiempo: req.body.medidaTiempo,
        idTipoServicio: req.body.idTipoServicio,
    })
    .then(servicio =>{
        res.redirect('/servicios');
        // res.json(tag)
    })
    .catch(err => {
        // console.log(err)
    })
}

exports.getServicios = async(req,res)=>{
    await Servicios.findAll()
    .then(servicio =>{
        // res.redirect('/mostrar-tags');
        res.json(servicio)
    })
    .catch(err => {
        // console.log(err)
    })
}

exports.getServicio = async(req,res)=>{
    await Servicios.findAll({
        where: {
            id: req.params.IdServicio
        }
    }).then(servicio =>{
        res.json(servicio)
    })
}
exports.editarServicio = async(req,res)=>{
    console.log("req.body: ")
    // console.log(req.body)
    await Servicios.update(
    req.body,
    {where: {
        id: req.body.IdServicio
    }}
    )
    .then(function(rowsUpdated) {
    // res.json(rowsUpdated)
        res.redirect("/servicios")
    
    })
    .catch(next)
}
exports.eliminarServicio = async(req,res)=>{
    
    await Servicios.findAll({
        where:{
            id: req.params.IdServicio
        }
    }).then(async servicios => {
        await Servicios.destroy({ 
            where:{id: req.params.IdServicio}
           }).then(function(eliminado3){
             res.redirect('/servicios')
           }).catch(next)
    })
    
}

exports.createTipoServicios = async(req,res)=>{
    await TipoServicios.create(req.body)
    .then(servicio =>{
        res.redirect('/tipoServicios');
        // res.json(tag)
    })
    .catch(err => {
        // console.log(err)
    })
}

exports.getTipoServicios = async(req,res)=>{
    await TipoServicios.findAll()
    .then(tipoServicio =>{
        // res.redirect('/mostrar-tags');
        res.json(tipoServicio)
    })
    .catch(err => {
        // console.log(err)
    })
}
exports.getServiciosWithId = async(req,res,next)=>{
    // console.log("req.session.usuarioId")
    // console.log(req.session.usuarioId)
    if(req.session.usuarioId == undefined){
        res.json({"mensaje": "noUser"})
    }else{
        try{
            const servicio = await Servicios.findAll({
                where: {
                    idTipoServicio: req.params.IdTipoServicio
                }
            });
            res.json({mensaje: "siUser",servicio: servicio});
        }catch(error){
            // console.log(error)
            next();
        }
       
    }
    
}

exports.agregarCompraCalcetines = async(req,res,next)=>{
    // res.json(req.body)

    await Servicios.findAll({
        where:{
            id: req.body.idServicio
        }
    }).then(async servicio =>{
        // console.log(servicio[0].nombreServicio)
        if(req.session.usuarioId == undefined){
            res.json({"mensaje": "noUser"})
        }else{
            await CompraCalcetines.findAll({
                where:{
                    idUsuario: req.session.usuarioId,
                    idServicio: req.body.idServicio,
                }
            }).then(async resultadoBusqueda => {
                // console.log("resultadoBusqueda: ")
                // console.log(resultadoBusqueda)
                if(resultadoBusqueda == ""){
                    console.log("no existe en la base de datos")
                    await CompraCalcetines.create({
    
                        idServicio: req.body.idServicio,
                        nombreServicio: servicio[0].nombreServicio,
                        descripcionServicio: servicio[0].descripcionServicio,
                        precioServicio: servicio[0].precioServicio,
                        tiempo: servicio[0].tiempo,
                        medidaTiempo: servicio[0].medidaTiempo,
                        idTipoServicio: servicio[0].idTipoServicio,
                        idUsuario: req.session.usuarioId,
                        cantidad: 1,
                    })
                    .then(async (compraCalcetines) =>{
                        // res.redirect('/servicios');
                        console.log("req.session.usuarioId: ")
                        // console.log(req.session.usuarioId)
                        console.log("req.body.idServicio: ")
                        // console.log(req.body.idServicio)
                        await CompraCalcetines.findAll({
                            where:{
                                idUsuario: req.session.usuarioId,
                                idTipoServicio: servicio[0].idTipoServicio,
                            }
                        }).then(todosCalcetines =>{
                            res.json({mensaje: "noUser", servicio: todosCalcetines})
                        }).catch(error => {
                            // console.log(error)
                        })
                        
                    }).catch(err => {
                        // console.log(err)
                    })
                }else{
                    console.log("ya existe en la base de datos")
                    // res.json(resultadoBusqueda)
                    var nuevaCantidad = resultadoBusqueda[0].cantidad + 1;
                    // console.log(nuevaCantidad)
                    await CompraCalcetines.update(
                        {cantidad: nuevaCantidad},
                        {where: {
                          id: resultadoBusqueda[0].id
                        }}
                      )
                      .then(async (rowsUpdated) =>{
                        await CompraCalcetines.findAll({
                            where:{
                                idUsuario: req.session.usuarioId,
                                idTipoServicio: req.params.IdTipoServicio,
                            }
                        }).then(todosCalcetines =>{
                            
                            res.json({mensaje: "noUser", servicio: todosCalcetines})
                        }).catch(error => {
                            // console.log(error)
                        })
                        
                      })
                      .catch(next)
                }
                // prueba123
            }).catch(error => {
                // console.log(error)
            })
        }
        
        
    }).catch(error => {
        // console.log("error")
    })
    
    

    
}

exports.getCompraCalcetines = async(req,res)=>{
    // res.json(req.params.IdTipoServicio)
    await CompraCalcetines.findAll({
        where:{
            idUsuario: req.session.usuarioId,
            idTipoServicio: req.params.IdTipoServicio,
        }
    }).then(todosCalcetines =>{
        res.json(todosCalcetines)
    }).catch(error => {
        // console.log(error)
    })
}
