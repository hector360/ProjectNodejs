const funcionesVinculoBrazaletes = require('../functions/funcionesVinculoBrazaletes');
const funcionesUsuarios = require('../functions/funcionesUsuarios');
const funcionesSnacks = require('../functions/funcionesSnacks');
const funcionesBoutique = require('../functions/funcionesBoutique');

exports.getUsuarioFromMembresia = async(req,res,next) => {
    console.log("req.params.codigo_brazalete")
    console.log(req.params.codigo_brazalete)
    var vinculoBrazalete = await funcionesVinculoBrazaletes.getVinculoBrazaletes(req.params.codigo_brazalete);
    console.log("vinculoBrazalete");
    console.log(vinculoBrazalete);
    if(vinculoBrazalete == null){
        var usuario = await funcionesUsuarios.getdataUsuario(req.params.codigo_brazalete)
        if(usuario == null){
            res.json({
                status: "failed",
                message: "Usuario no encontrado",
            });
        }else{
            res.json({
                status: "success",
                message: "Usuario encontrado",
                id_usuario_personalizado: usuario.idUsuarioPersonalizado
            });
        }
        
    }else{
        console.log(vinculoBrazalete.id_usuario_personalizado)
        // var usuario = await funcionesUsuarios.getdataUsuario(vinculoBrazalete.id_usuario_personalizado);
        res.json({
            status: "success",
            message: "Usuario encontrado",
            id_usuario_personalizado: vinculoBrazalete.id_usuario_personalizado
        });
    }
    
}
exports.getProductosSnack = async(req,res,next) => {
    console.log(req.params.id_tipo_producto)
    var snacks = await funcionesSnacks.getProductosSnack(req.params.id_tipo_producto);
    console.log(snacks)
    res.json(snacks);
}
exports.getProductosBoutique = async(req,res,next) => {
    console.log("boutique")
    console.log(req.params.id_tipo_producto)
    var almohadas = await funcionesBoutique.getProductosBoutique(1);
    var playeras = await funcionesBoutique.getProductosBoutique(2);
    var tazas = await funcionesBoutique.getProductosBoutique(3);
    var libros = await funcionesBoutique.getProductosBoutique(4);
    var gorras = await funcionesBoutique.getProductosBoutique(5);
    var arrayBoutique = {
        almohadas,
        playeras,
        tazas,
        libros,
        gorras
    }
    console.log(arrayBoutique)
    res.json(arrayBoutique);
}