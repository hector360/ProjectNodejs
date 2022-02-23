const TipoAsiento = require('../database/models/TipoAsiento');

exports.reservarAsiento = async(req,res,next)=>{
    res.json("reservaremos")
}

exports.crearTipoAsiento = async(req,res,next)=>{
    // TipoAsiento
    var nombre = req.body.nombre

    var slug = await generarSlug(nombre)
    await TipoAsiento.create({
        nombre: nombre,
        slug: slug,
        status: 1
    }).then(tipoAsiento => {
        res.json(tipoAsiento);
    }).catch(error => {
        console.log(error)
    })
}


function generarSlug(titulo){
    // var sinEspacios = titulo.replace(/\s/g, '');
    console.log(titulo)
    var sinEspacios =  titulo.replace(/\s/g, "-");
    sinEspacios = sinEspacios.toLowerCase();
    return sinEspacios;
}