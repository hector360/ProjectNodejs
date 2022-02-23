const Usuario = require('../database/models/Usuarios');
const bcrypt = require('bcrypt');
const funcionesGenerador = require('../functions/funcionesGenerador');

async function getdataUsuario(id_usuario_personalizada){
    return await Usuario.findOne({
        where: {
            idUsuarioPersonalizado: id_usuario_personalizada
        }
    }).then(usuario => {
        // console.log(usuario.dataValues)
        return usuario;
    }).catch(error => {
        console.log(error)
    })
    
}
async function verificarUsuarioExistente(email){
    return await Usuario.findOne({
        where: {
            email: email
        }
    }).then(usuario => {
        return usuario;
    }).catch(error => {
        console.log(error)
    })
}
async function encontrarOCrearUsuario(userData){
   
    return await Usuario.findOne({
        where: {
            email: userData.email_user
        }
    }).then(async usuario => {
        if(usuario == null){
            var password = await funcionesGenerador.createPassword();
            var idUsuarioPersonalizado = await funcionesGenerador.windowGuid();
            var nuevaPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            return await Usuario.create({
                nombres: userData.nombre_user,
                apellidos: userData.apellidos_user,
                email: userData.email_user,
                celular: userData.numero_user,
                password: nuevaPassword,
                idUsuarioPersonalizado: idUsuarioPersonalizado,
                idTipoUsuario: 3
            }).then(usuario => usuario)
        }else{
            return usuario;
        }
        
    }).catch(error => {
        console.log(error)
    })
}

module.exports = {
    getdataUsuario,
    verificarUsuarioExistente,
    encontrarOCrearUsuario
}