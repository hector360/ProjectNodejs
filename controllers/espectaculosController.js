const funcionesPost = require('../functions/funcionesPost')
const funcionesProductos = require('../functions/funcionesProductos');
const funcionesCartelera = require('../functions/funcionesCartelera');
const funcionesEspectaculos = require('../functions/funcionesEspectaculos');
const funcionesFechaCartelera = require('../functions/funcionesFechaCartelera');

exports.getAllEspectaculos = async(req,res,next)=>{
    await funcionesEspectaculos.getAllEspectaculos()
        .then(espectaculos => {
            res.json(espectaculos)
        }).catch(error => {
            console.log(error);
        })
}
exports.getEspectaculos = async(req,res,next)=>{
    await funcionesPost.getPostsEspectaculos().then(async espectaculos => {
        // console.log(espectaculos)
        // res.json(espectaculos)
        var arrayEspectaculos = [];
        
        // espectaculos.map(async esp =>{
        //     // console.log(esp.id_producto)
           
        // })
        for(let i = 0; i < espectaculos.length; i++){
            
            await funcionesProductos.getProducto(espectaculos[i].id_producto).then(async productos => {
                // console.log(productos)
                // await funcionesCartelera.getCartelera(espectaculos[i].id).then(async cartelera => {
                    
                //     // funcionesCartelera.getFechaCartelera(cartelera.dataValues.idFecha).then(fechaCartelera => {

                //     // }).catch(error => {
                //     //     console.log(error)
                //     // })
                //     for(let a = 0; a< cartelera.length; a++){
                //         arrayFechas.push({
                //             fechaHoraEntrada: cartelera.fechaHoraEntrada,
                //             fechaHoraSalida: cartelera.fechaHoraSalida,
                //         })
                //     }
                    
                // }).catch(error => {
                //     console.log(error);
                // })
                var arrayFechas = [];
                var cartelera = await funcionesCartelera.getCartelera(espectaculos[i].id);
                for(let a = 0; a< cartelera.length; a++){
                    // console.log()
                    arrayFechas.push({
                        // fechaHoraEntrada: cartelera[i].fechaHoraEntrada,
                        // fechaHoraSalida: cartelera[i].fechaHoraSalida,
                        idFecha: cartelera[i].idFechaCartelera,
                    })
                    // console.log("idfechas")
                    // console.log(cartelera[a].idFechaCartelera)
                    var fechaCartelera = await funcionesCartelera.getFechaCartelera(cartelera[a].idFechaCartelera);
                    console.log(fechaCartelera.dataValues.fechaDia)
                }
                // console.log(arrayFechas)
                    arrayEspectaculos.push({
                        titulo: espectaculos[i].titulo,
                        urlImagenPost: espectaculos[i].urlImagenPost,
                        slug: espectaculos[i].slug,
                        precioAdulto: productos.dataValues.precio,
                        precio_ninos: productos.dataValues.precio_ninos,
                        fechas: arrayFechas
                    })
                
            })
        }
        // console.log(arrayEspectaculos)
        res.json(arrayEspectaculos)
        // espectaculos.map
        // funcionesProductos.getProducto()
    }).catch(error => {
        console.log(error)
    })
}

exports.getDatosEspectaculo = async (req,res,next) => {
    console.log("req.params.slug")
    console.log(req.params.slug)
    const espectaculo = await funcionesEspectaculos.getDatosEspectaculo(req.params.slug);

    const cartelera = espectaculo.carteleras.map((cartelera) => {
        return {
            fecha: cartelera.fechaCartelera.fechaDia,
            status: cartelera.status,
            horarios: cartelera.horas_espectaculos.map((hora) => hora.fechaHoraEntrada)
        }
    })

    const _espectaculo = {
        id: espectaculo.id,
        nombre: espectaculo.nombre,
        descripcion: espectaculo.descripcion,
        urlImagenPost: espectaculo.urlImagenPost,
        urlImagenMovil: espectaculo.urlImagenMovil,
        slug: espectaculo.slug,
        id_producto: espectaculo.id_producto,
        asientos_vip: espectaculo.asientos_vip,
        asientos_filas: espectaculo.asientos_filas,
        asientos_mesas: espectaculo.asientos_mesas,
        mesas_vip: espectaculo.mesas_vip,
        urlImagenMapa: espectaculo.urlImagenMapa,
        precio_regular: espectaculo.precio_regular,
        precio_vip: espectaculo.precio_vip,
        precio_adicional: espectaculo.precio_adicional,
        precio_mesa_vip: espectaculo.precio_mesa_vip,
        createdAt: espectaculo.createdAt,
        updatedAt: espectaculo.updatedAt,
        cartelera
    }
    console.log(_espectaculo)
    res.json(_espectaculo);
    
}

exports.getFechasEspectaculo = async (req,res,next)=>{
    // console.log(req.params.slug)
    var slug = req.params.slug;
    await funcionesEspectaculos.getDatosEspectaculo(slug)
        .then(async espectaculo => {
            console.log("slug: ",slug)
            console.log(espectaculo)
            await funcionesEspectaculos.getFechasEspectaculo(espectaculo.id)
                .then(async fechas => {
                    console.log(fechas)
                    var arrayFechas = [];
                    for(var i = 0; i < fechas.length; i++){
                        var fechas_c = await funcionesFechaCartelera.getFechaCartelera(fechas[i].idFechaCartelera);
                        arrayFechas.push({
                            id: fechas[i].id,
                            fechaCartelera: fechas_c.fechaDia,
                            id_espectaculos: fechas[i].id_espectaculos
                        })
                    }
                    console.log(arrayFechas)
                    res.json(arrayFechas);
                })
        }).catch(error => {
            console.log(error)
        })

    
}

exports.getHoras = async (req,res,next)=>{
    console.log(req.params.id_cartelera)
    await funcionesFechaCartelera.getHoras(req.params.id_cartelera)
        .then(horas => {
            // console.log(horas)
            var arrayHoras = [];
            for(var i = 0; i < horas.length; i++){
                var horaFormat = horas[i].fechaHoraEntrada;
                horaFormat = horaFormat.split(":");
                console.log("horaFormat")
                
                // horaFormat = horaFormat[0] + ":"+horaFormat[1]
                
                horaFormat = formatHora(horaFormat[0]);
                // horaFormat = await formatHora("01");
                arrayHoras.push({
                    id: horas[i].id,
                    id_cartelera: horas[i].id_cartelera,
                    fechaHoraEntrada: horas[i].fechaHoraEntrada,
                    HoraEntradaFormat: horaFormat,
                    fechaHoraSalida: horas[i].fechaHoraSalida,
                    createdAt: horas[i].createdAt,
                    updatedAt: horas[i].updatedAt
                })
            }
            res.json(arrayHoras)
        })
}

exports.createImagenEspectaculos = async (req,res,next)=>{
    
    var data = {
        id_espectaculos: req.body.id_espectaculos,
        imagen_espectaculo: req.body.imagen_espectaculo,
    }
    var imagenEspectaculo = await funcionesEspectaculos.createImagenEspectaculos(data);
    res.json(imagenEspectaculo)
}

exports.getImagenesEspectaculos = async (req,res,next) => {
    console.log(req.params.slug)
    var espectaculos = await funcionesEspectaculos.getDatosEspectaculo(req.params.slug);
    var imagenesEspc = await funcionesEspectaculos.getImagenesEspectaculos(espectaculos.id);
    console.log(imagenesEspc)
    res.json(imagenesEspc)
}
function formatHora(horaPrimer){
    // console.log(horaFormat)
    // var primerValor = horaPrimer.slice(0, 1);
    // if(primerValor == 0){
    //     var valor = horaPrimer.slice(1, 2);
    // }else{
    //     var valor = horaPrimer;
    // }
    
    var horaValo1 = horaPrimer.slice(0, 1)
    var horaValo2 = horaPrimer.slice(1, 2)
    if(horaValo1 == 0){
        var valor = horaValo2;
    }else{
        var valor = horaPrimer;
    }

    const meses = [
        "1:00 am",
        "2:00 am",
        "3:00 am",
        "4:00 am",
        "5:00 am",
        "6:00 am",
        "7:00 am",
        "8:00 am",
        "9:00 am",
        "10:00 am",
        "11:00 am",
        "12:00 am",
        "1:00 pm",
        "2:00 pm",
        "3:00 pm",
        "4:00 pm",
        "5:00 pm",
        "6:00 pm",
        "7:00 pm",
        "8:00 pm",
        "9:00 pm",
        "10:00 pm",
        "11:00 pm",
        "12:00 pm",
      ];
      var nuevoValor = parseInt(valor) - 1;
      return meses[nuevoValor]
}