const Cartelera = require('../database/models/Cartelera');
const FechaCartelera = require('../database/models/FechaCartelera');
const Posts = require('../database/models/Posts');

exports.crearCartelera = async(req,res)=>{
    console.log(req.body)
    // { fechaFuncion: '2021-03-04', horaFuncion: '13:26', idPost: '44' }

    
        
        // await Cartelera.create({
        //     idPost: req.body.idPost,
        //     fechaDia: req.body.fechaFuncion,
        //     fechaHora: req.body.horaFuncion,
        // }).then(cartelera => {
        //     console.log(cartelera)
        //     res.redirect('/cartelera');
        // })

        await FechaCartelera.findAll({
            where:{
                fechaDia: req.body.fechaFuncion,
            }
        }).then(async fechacartel => {
            if(fechacartel == ""){
                console.log("no existe la fecha")
                await FechaCartelera.create({
                    fechaDia: req.body.fechaFuncion,
                }).then(async fc => {
                    console.log(fc.id)
                    // await Cartelera.findAll({
                    //     where: {
                    //         fechaHoraEntrada: req.body.fechaHoraEntrada
                    //     }
                    // }).then(async cartelera => {
                        // console.log(cartelera)
                        // if(cartelera == ""){
                            console.log("la hora esta disponible")
                            await Cartelera.create({
                                idPost: req.body.idPost,
                                idFechaCartelera: fc.id,
                                fechaHoraEntrada: req.body.fechaHoraEntrada,
                                fechaHoraSalida: req.body.fechaHoraSalida
                            }).then(response => {
                                console.log("se ha creado la cartelera")
                                // res.json({"mensaje": "se ha creado la cartelera"})
                                res.redirect('/cartelera')
                            })
                        // }else{
                        //     console.log("la hora esta ocupada")
                        // }
                    // })
                }).catch(error => {
                    console.log(error)
                    res.json(error);
                })
            }else{
                console.log("la fecha ya existe")
                console.log(fechacartel[0].id)

                await Cartelera.findAll({
                    where: {
                        fechaHoraEntrada: req.body.fechaHoraEntrada
                    }
                }).then(async cartelera => {
                    console.log(cartelera)
                    if(cartelera == ""){
                        console.log("la hora esta disponible")
                        await Cartelera.create({
                            idPost: req.body.idPost,
                            idFechaCartelera: fechacartel[0].id,
                            fechaHoraEntrada: req.body.fechaHoraEntrada,
                            fechaHoraSalida: req.body.fechaHoraSalida
                        }).then(response => {
                            console.log("se ha creado la cartelera")
                            // res.json({"mensaje": "se ha creado la cartelera"})
                            res.redirect('/cartelera')
                        })
                    }else{
                        console.log("la hora esta ocupada")
                        res.json({"message": "la hora esta ocupada"})
                    }
                })

            }
            // console.log(fechacartel)
            // res.json(fechacartel)
        })
//         await FechaCartelera.create({

//         })
// fechaHoraEntrada: {
//     type: DataTypes.TIME,
// },
// fechaHoraSalida: {
//     type: DataTypes.TIME,
// },  
//         await Cartelera.create({
//             idPost: req.body.idPost,
//             fechaDia: req.body.fechaFuncion,
//             fechaHora: req.body.horaFuncion,
//         }).then(cartelera => {
//             console.log(cartelera)
//             res.redirect('/cartelera');
//         })
       
    
}
exports.getCartelera = async(req,res,next)=>{
    
    await Cartelera.findAll({
        where:{
            idFechaCartelera: req.params.IdFechaCartelera
        }
    }).then(async cartelera => {
        // res.json(cartelera)
        var array = [];
        // cartelera.map(async (ca)=>{
        //     console.log(ca)
        //     var post = await Posts.findAll({
        //         where:{
        //             id: ca.idPost
        //         }
        //     })
        //     array.push({
        //         "id": ca.id,
        //         "fechaHoraEntrada": ca.fechaHoraEntrada,
        //         "fechaHoraSalida": ca.fechaHoraSalida,
        //         "idFechaCartelera": ca.idFechaCartelera,
        //         "idPost": ca.idPost,
        //         "post": "post",
        //         "createdAt": ca.createdAt,
        //         "updatedAt": ca.updatedAt
        //     })
            
        // });
            
        for(var i = 0; i< cartelera.length; i++){
            var post = await Posts.findAll({
                where:{
                    id: cartelera[i].idPost
                }
            })
            array.push({
                "id": cartelera[i].id,
                "fechaHoraEntrada": cartelera[i].fechaHoraEntrada,
                "fechaHoraSalida": cartelera[i].fechaHoraSalida,
                "idFechaCartelera": cartelera[i].idFechaCartelera,
                "idPost": cartelera[i].idPost,
                "post": post,
                "createdAt": cartelera[i].createdAt,
                "updatedAt": cartelera[i].updatedAt
            })
        }
        res.json(array)
    })
}
exports.getFechaCartelera = async(req,res,next)=>{
    var json = {};
    await FechaCartelera.findAll()
        .then(fechaCartelera => {
    
            res.json(fechaCartelera)
        })
}

exports.getCarteleraFromFecha = async (req,res,next)=> {
    await FechaCartelera.findOne({
        where: {
            fechaDia: req.params.fecha
        }
    }).then(async fechaCartelera => {
        await Cartelera.findOne({
            where: {
                idFechaCartelera: fechaCartelera.id
            }
        }).then(cartelera => {
            console.log(cartelera)
            res.json(cartelera)
        })
    })
}