const Usuarios = require('../database/models/Usuarios');
const NinosUser = require('../database/models/NinosUser');
const NinosMembresia = require('../database/models/NinosMembresia');
const Membresia = require('../database/models/Membresia');
const funcionesGenerador = require('../functions/funcionesGenerador');

const jwt = require('jsonwebtoken');
const URLMAGICCRM = require('../variableGlobal/config');
const Producto = require('../database/models/Producto');
const PRIVATEKEY = URLMAGICCRM.PRIVATEKEY;
const funcionesNinos = require('../functions/funcionesNinos');
const funcionesUsuarios = require('../functions/funcionesUsuarios');

exports.getNinosMembresias = async (req,res,next)=>{
    const authHeader = req.get('Authorization');
    // if(!authHeader){
    //     const error = new Error('No autenticado no hay JWT');
    //     error.statusCode = 401;
    //     throw error;
    // }

    const token = authHeader.split(' ')[1]
    var usuario = await getUsuario(token);
    var ninoUser = await getNinosUsers(usuario.id);
    // var ninosMembresia = await getNinosMembresia(ninoUser.id);
    console.log(ninoUser);
    var array = [];
    for(var i = 0; i < ninoUser.length; i++){
        var ninosMembresia = await getNinosMembresia(ninoUser[i].id);
        var membresia = await getMembresia(ninosMembresia.id_membresia);
        var producto = await getProducto(membresia.id_producto);
        array.push({"id": ninoUser[i].id, "nombreNino": ninoUser[i].nombre, "horas_globales": ninoUser[i].horas_globales,"id_membresia": ninosMembresia.id_membresia, "sku_membresia": ninosMembresia.sku_membresia, "nombre_membresia": producto.nombreProducto});
    }
    console.log(array);
    res.json(array)
}
exports.getTodosNinos = async(req,res,next) => {
    var usuario = await funcionesUsuarios.getdataUsuario(req.params.id_usuarioP)
    var ninos = await funcionesNinos.getTodosNinos(usuario.id);
    console.log(ninos)
    res.json(ninos);
}

exports.ninoCreate = async(req,res,next)=>{
    var id_usuarioP = req.body.id_usuarioP;
    var nombreNino = req.body.nombre_nino;
    var dt = new Date();
    var anio = dt.getYear();
    var valorRandom = await funcionesGenerador.windowGuid2();
    var nuevoSku = "V-"+anio+valorRandom;

    var usuario = await funcionesUsuarios.getdataUsuario(id_usuarioP)
    var ninos = await funcionesNinos.ninoCreate(usuario.id ,nombreNino);
    console.log(ninos)
    var data = {
        id_nino: ninos.id,
        id_membresia: 4,
        sku_membresia: nuevoSku,
        status: 1,
        total_dias: 365
    }
        
    var ninosMembresias = await funcionesNinos.ninoMembresiaCreate(data);
    
    console.log(ninosMembresias)
    res.json(ninosMembresias);
}

async function getUsuario(token){
    revisarToken = jwt.verify(token, PRIVATEKEY); 
    let idUsuarioPersonalizado = revisarToken.idUsuarioPersonalizado;
    // console.log(idUsuarioPersonalizado);

    return await Usuarios.findOne({
        where: {
            idUsuarioPersonalizado: idUsuarioPersonalizado,
        }
    }).then(usuario =>{
        return usuario.dataValues;
    })
}
async function getNinosUsers(idUsuario){
    console.log(idUsuario);
    return await NinosUser.findAll({
        where: {
            id_user: idUsuario
        }
    }).then(ninoUser => {
        return ninoUser
    });
}
async function getNinosMembresia(ninoUser){
    return await NinosMembresia.findOne({
        where: {
            id_nino: ninoUser
        }
    }).then(ninoMembresia => {
        return ninoMembresia.dataValues;
    })
}
async function getMembresia(idMembresia){
    return await Membresia.findOne({
        where: {
          id: idMembresia  
        }
    }).then(membresia => {
        return membresia.dataValues
    })
}
async function getProducto(idProducto){
    return await Producto.findOne({
        where: {
            id: idProducto
        }
    }).then(producto => {
        return producto.dataValues;
    })
}

exports.getNinosPadres = async(req,res,next)=>{
    
    res.json({"mensaje": "holapapa"})
}