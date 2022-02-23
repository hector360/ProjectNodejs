const Usuarios = require('../database/models/Usuarios');
const TipoUsuario = require('../database/models/TipoUsuario');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcrypt-nodejs');
const uuidv1 = require('uuidv1');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const {sendEmail} = require('../functions/sendEmail');
const { getResetRequest, createResetRequest } = require("../functions/resetRequests");
const nodemailer = require('nodemailer');
const Usuario = require('../database/models/Usuarios');
const idEmpleadoTemporal = 2;
const URLMAGICCRM = require('../variableGlobal/config');
const NinosUser = require('../database/models/NinosUser');
const NinosMembresia = require('../database/models/NinosMembresia');
const PadresUser = require('../database/models/PadresUser');
const URLMAGIC = URLMAGICCRM.URLMAGICCRM;
const PRIVATEKEY = URLMAGICCRM.PRIVATEKEY;
const funcionesUsuarios = require('../functions/funcionesUsuarios');
const Ticket = require('../database/models/Ticket');
const moment = require('moment');
const { Op } = require('sequelize');
const TicketProducto = require('../database/models/TicketProducto');
const Producto = require('../database/models/Producto');
const { getPurchasesByUserId } = require('../repository/usersRepository');

exports.getPurchasesByUserController = async (req, res, next) => {
    try {
        const user = await getPurchasesByUserId(req.params.userId);

        if (user.isBoom) res.status(200).json({
            status: 404,
            message: {
                tickets: []
            }
        });;

        res.status(200).json({
            status: res.statusCode,
            message: user
        });
    } catch (err) {
        next(boom.internal(err));
    }
}

exports.getUsuarios = async(req,res, next)=>{
    try{
        const usuarios = await Usuarios.findAll();
        var data = [];
        for(var i = 0; i < usuarios.length; i++){
            const tipoUsuario = await TipoUsuario.findAll({
                where:{
                    id: usuarios[i].idTipoUsuario
                }
            });
            data.push({

                "email": usuarios[i].email,
                "nombres": usuarios[i].nombres,
                "password": usuarios[i].password,
                // "IdTipoUsuario": usuarios[i].IdTipoUsuario,
                "tipoUsuario": tipoUsuario[0].nombre
            });
        }
        res.json(data);
    }catch(err){
        // console.log(err);
        next();
    }
}
exports.getUsuario = async(req,res, next)=>{
    try{
        const usuario = await Usuarios.findAll({
            where:{
                id: req.params.IdUsuario
            }
        });
        
        res.json(usuario);
    }catch(err){
        // console.log(err);
        next();
    }
}




exports.crearCuentaPrivada = async(req,res, next)=>{
    //leer los datos del usuario
    var idTipoUsuario;
    var IdUsuarioPersonalizado = await windowGuid();
    if(req.body.idTipoUsuario == "Empleado"){
        //id del administrador
        idTipoUsuario = idEmpleadoTemporal
    }else{
        //id del empleado
        idTipoUsuario = 1;
    }

    try{
        console.log(req.body);
        // var nuevaPassword = await bcrypt.hash(req.body.password, 12);
        var nuevaPassword = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        console.log("contraseñaa: ");
        // console.log(nuevaPassword);
        const usuario = await Usuarios.create({

            email: req.body.email,
            nombres: req.body.nombres,
            password: nuevaPassword,
            idTipoUsuario: idTipoUsuario,
            celular: req.body.celular,
            apellidos: req.body.apellidos,
            idUsuarioPersonalizado: IdUsuarioPersonalizado,
            
        });

        res.json({mensaje: usuario});

    }catch(error){
        console.log(error);
        res.json({mensaje: 'Hubo un error'});
        next();
    }
}

exports.crearTipoUsuario = async(req,res,next)=>{

    try{
        const tipoUsuario = await TipoUsuario.create(req.body);
        res.json({mensaje: "Se creo el tipo usuario correctamente", response: tipoUsuario})
    }catch(err){
        // console.log(err);
        next();
    }
}

exports.getMaestros = async(req,res, next)=>{
    try{
        const usuarios = await Usuarios.findAll({
            where:{
                idTipoUsuario: idEmpleadoTemporal
            }
        });
        res.json(usuarios);
    }catch(err){
        // console.log(err);
        next();
    }
}


exports.signup2 = async(req,res, next)=>{
    try {
        // Receiving Data
        const { nombres, celular, email, password, idTipoUsuario, apellidos, registroEntrada } = req.body;
        // Creating a new User
        // let nuevaPassword = encryptPassword(password);
        var IdUsuarioPersonalizado = await windowGuid();
        var nuevaPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        var tipoUsuario;
        if(idTipoUsuario == 'cliente'){
            tipoUsuario = 3;
        }
        var usuario = await funcionesUsuarios.verificarUsuarioExistente(email)
        console.log("usuario")
        console.log(usuario)
        if(usuario == null){
            const user = await Usuarios.create({
                "nombres": nombres,
                "apellidos": apellidos,
                "celular": celular,
                "email": email,
                "password": nuevaPassword,
                "idTipoUsuario": tipoUsuario,
                "idUsuarioPersonalizado": IdUsuarioPersonalizado,
            });
            // user.password = await user.encryptPassword(password);
            // await user.save();
            // Create a Token
            const token = jwt.sign({ id: user.id }, PRIVATEKEY, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            });
    
            // res.json({ auth: true, token });
    
    
            req.session.token = token;
            req.session.usuario = user.email;
            req.session.usuarioId = user.id;
            // console.log("sess.token: ", req.session.token)
            // console.log("session.usuario: ", req.session.usuario)
            
            if(registroEntrada){
                console.log("se va enviar el usuario");
                // sendEmail(req.body.data.object.metadata.email, mensaje, `Hola que tal tripulante, a continuación dejamos el link para que puedas reiniciar la contraseña de tu cuenta de Magic Planet: ${URLMAGIC}/password-reset?id=${usuario.idUsuarioPersonalizado}`);
                let mensaje = `Hola que tal tripulante, a continuación dejamos el link para que puedas reiniciar la contraseña de tu cuenta de Magic Planet: ${URLMAGIC}/password-reset?id=${user.idUsuarioPersonalizado}`;
                var correoEnviadito = sendEmail(user.email, mensaje, `Gracias por Registrarte ${user.nombres}`);
                console.log(correoEnviadito)
            }
            res.status(200).json({auth: true, token, usuario: user.email, usuarioId: user.id, idUsuarioPersonalizado: user.idUsuarioPersonalizado});
        }else{
            console.log("el correo esta usado")
            return res.status(200).json({auth: false, mensaje: "El corro ya esta ocupado"});
        }
        
        


    } catch (e) {
        // console.log(e)
        res.status(500).send('There was a problem registering your user');
        next();
    }
}

exports.registroLeads = async(req,res, next)=>{
    
     const { nombres, apellidos, nombreNino, celular, email, idTipoUsuario,  registroEntrada } = req.body;
     console.log(req.body)
     var IdUsuarioPersonalizado = await windowGuid();
     var nuevaPassword = await bcrypt.hashSync("a1b2-c3v4-b5n6", bcrypt.genSaltSync(10));
     var tipoUsuario;
     if(idTipoUsuario == 'cliente'){
         tipoUsuario = 3;
     }
     var usuario = await funcionesUsuarios.verificarUsuarioExistente(email)
     console.log("usuario")
     console.log(usuario)
     if(usuario == null){
         await Usuarios.create({
             "nombres": nombres,
             "apellidos": apellidos,
             "celular": celular,
             "email": email,
             "password": nuevaPassword,
             "idTipoUsuario": tipoUsuario,
             "idUsuarioPersonalizado": IdUsuarioPersonalizado,
         }).then(async user => {
            const token = jwt.sign({ id: user.id }, PRIVATEKEY, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
            });
            if(registroEntrada){
                console.log("se va enviar el usuario");
                
                let mensaje = `Hola que tal tripulante, a continuación dejamos el link para que puedas reiniciar la contraseña de tu cuenta de Magic Planet: ${URLMAGIC}/password-reset?id=${user.idUsuarioPersonalizado}`;
                var correoEnviadito = sendEmail(user.email, mensaje, `Gracias por Registrarte ${user.nombres}`);
                console.log(correoEnviadito)
            }
            await NinosUser.create({
                nombre: nombreNino,
                id_user: user.id,
                horas_globales: 0,
                status: 0,
            }).then(ninoUser => {
                res.status(200).json({auth: true, token, usuario: user.email, usuarioId: user.id, idUsuarioPersonalizado: user.idUsuarioPersonalizado});
            }).catch(error => {
                console.log(error)
            })
            
         }).catch(error => {
            console.log(error)
         });
     }else{
         console.log("el correo esta usado")
         return res.status(200).json({auth: false, mensaje: "El corro ya esta ocupado"});
     }
}

exports.signin2 = async(req,res, next)=>{ 
    
    try {
        
        const user = await Usuarios.findAll({
            where: {email: req.body.email}
        })
    if(user == "") {
        return res.status(200).json({auth: false, token: "El correo no existe"});
    }
    // const validPassword = await bcrypt.compare(req.body.password, user[0].password);
    // console.log("password valida: ")
    // console.log(user[0].password)
    // if (!validPassword) {
    //     return res.status(401).send({auth: false, token: null});
    // }
    // if(!bcrypt.compare(req.body.password, user[0].password)) {
    //     return res.status(404).send("Contraseña incorrecta")
    //   }
    const validPassword = await bcrypt.compareSync(req.body.password, user[0].password);
    if (!validPassword) {
        return res.status(200).json({auth: false, token: "La contraseña es incorrecta"});
    }
    const token = jwt.sign({id: user.id, idUsuarioPersonalizado: user[0].idUsuarioPersonalizado}, PRIVATEKEY, {
        expiresIn: 60 * 60 * 24
    });
    req.session.token = token;
    req.session.usuario = user[0].email;
    req.session.usuarioId = user[0].id;
    // console.log("sess.token: ", req.session.token)
    // console.log("session.usuario: ", req.session.usuario)

    // var revisarToken = jwt.verify(token, 'mysecretkey'); 
    //     console.log(revisarToken)
    res.status(200).json({auth: true, token, usuario: user[0].email, usuarioId: user[0].id});

    } catch (e) {
        // console.log(e)
        res.status(500).send('problema con el login');
        next();
    }
}
exports.traerUsuarios = async(req,res,next)=>{
    var array = [];
    await Usuario.findAll().then(usuarios =>{
        for(var i = 0; i < usuarios.length; i++){
            array.push(usuarios[i].email);
        }
        res.json(array);
    }).catch(error => {
        console.log("error al traer el array de los usuarios")
        console.log(error)
    })
}
exports.traerUsuario = async(req,res,next)=>{
    await Usuario.findOne({
        where: {
            email: req.body.email
        }
    }).then(usuario =>{
        console.log(usuario)
        res.json(usuario);
    }).catch(error => {
        console.log("error al traer el usuario")
        console.log(error)
    })
}

exports.getUsuarioPersonal = async(req,res, next)=>{
    try{
        const usuario = await Usuarios.findAll({
            where:{
                idUsuarioPersonalizado: req.params.IdUsuario
            }
        });
        
        res.json(usuario);
    }catch(err){
        // console.log(err);
        next();
    }
}
// exports.forgot = async(req,res, next)=>{ 
   
//     await Usuarios.findOne({
//         where:{
//             email: req.body.email
//         }
//     }).then(thisUser =>{
//         if (thisUser) {
//             const id = uuidv1();
//             const request = {
//                 id,
//                 email: thisUser.email,
//             };
//             createResetRequest(request);
//             sendResetLink(thisUser.email, id);
//         }
//         res.status(200).json();
//     })
    
// }

exports.sendEmail = async(req,res, next)=>{
    console.log(req.body)
    await Usuario.findOne({
        where: {
            email: req.body.email
        }
    }).then(async usuario => {
        console.log(usuario.idUsuarioPersonalizado)
        
        // contentHtml =
        // `<h1>Este es el correo</h1>
        // <ul>
        //     <li>Username: ${req.body.email}</li>
        // </ul>
        // `;
       const transporter = nodemailer.createTransport({
            host: "single-9040.banahosting.com",
            port: 587,
            secure: false,
            auth: {
                user: "no-reply@magicplanet.club",
                pass: "M4gic2020*",
            },
            tls: {
                rejectUnauthorized: false,
            }
        });
       await transporter.sendMail({
            from: '"Magic Planet" <no-reply@magicplanet.club>',
            to: `${req.body.email}`,
            subject: 'Formulario para reinicio de contraseña',
            text: `Hola que tal tripulante, a continuación dejamos el link para que puedas reiniciar la contraseña de tu cuenta de Magic Planet: ${URLMAGIC}/password-reset?id=${usuario.idUsuarioPersonalizado}`
        }).then(info => {
            console.log(`Menensaje Enviado`);
            console.log("correo enviado")
            // res.json({mensaje: "correo enviado"});
            res.redirect(`${URLMAGIC}/correoEnviado`)
        }).catch(error => {
            console.log("error2:")
            console.log(error)
            console.log("error al enviar correo");
            res.redirect(`${URLMAGIC}/enviar-correo`)
        });

    }).catch(error => {
        console.log("error1:")
        console.log(error)
    })
    
        
}

exports.changePassword = async(req,res, next)=>{
    console.log(req.body)
    var nuevaPassword = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    await Usuario.update({
            password: nuevaPassword
        }, {
            where: {
            idUsuarioPersonalizado: req.body.uid,
            },
        }).then(usuarioActualizado =>{
            console.log("usuarioAc: ")
            console.log(usuarioActualizado)
            res.redirect(URLMAGIC);
        }).catch(error => {
            console.log(error);
        });
}

exports.getUsuarioVinculacion = async(req,res, next)=>{
    
    await Usuario.findOne({
        where: {
            email: req.body.email_usuario
        }
    }).then(async usuario =>{ 
        
        await NinosUser.findAll({
            where: {
                id_user: usuario.id
            }
        }).then(async ninoUser => {
            let arrayninosM = [];
            // ninoUser.map(async nu => {
            //     let ninosMembresia = await NinosMembresia.findOne({
            //         where: {
            //             id_nino: nu.id
            //         }
            //     });
            //     array.push(ninosMembresia.dataValues);
            //     console.log(ninosMembresia.dataValues)
            // });

            // res.json(array);
            for(let i = 0; i< ninoUser.length; i++){
                let ninosMembresia = await NinosMembresia.findOne({
                    where: {
                        id_nino: ninoUser[i].id
                    }
                });
                console.log(ninoUser[i].id)
                let nm = {
                    nombreNino: ninoUser[i].nombre,
                    horas_globales: ninoUser[i].horas_globales,
                    id_membresia: ninosMembresia.id_membresia,
                }
                arrayninosM.push(nm);
            }
            let array = {
                id: usuario.id,
                email: usuario.email,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                ninos:  arrayninosM
            }
            res.json(array)
        }).catch(error => {
            console.log("error al encontrar el ninoUser")
            console.log(error);
        })
    }).catch(error => {
        console.log("error al conseguir el usuario");
        console.log(error);
    })
}

exports.getUsuariosPersonas = async(req,res,next)=>{
    await Usuario.findOne({
        where: {
            idUsuarioPersonalizado: req.body.idUsuarioPersonalizado 
        }
    }).then(async usuario => {
        
        await NinosUser.findAll({
            where: {
                id_user: usuario.id
            }
        }).then(async ninoUser =>{
            // console.log(ninoUser)
            // res.json(ninoUser);
            
            await PadresUser.findAll({
                where: {
                    id_user: usuario.id
                }
            }).then(async padresUsuario => {
                // console.log(padresUsuario)
                // res.json(padresUsuario);
                var arrayNinoU = [];
                for(let i=0; i< ninoUser.length; i++){
                    let ninoMembresia = await getNinoMembresia(ninoUser[i].id)
                    console.log(ninoMembresia)
                    arrayNinoU.push({
                        id: ninoUser[i].id,
                        nombre: ninoUser[i].nombre,
                        id_user: ninoUser[i].id_user,
                        horas_globales: ninoUser[i].horas_globales,
                        status: ninoUser[i].status,
                        sku_membresia: ninoMembresia.sku_membresia
                        
                    })
                }
                
                var arrayUsuarios = {
                    email: usuario.email,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    idUsuarioPersonalizado: usuario.idUsuarioPersonalizado,
                    ninoUser: arrayNinoU,
                    padresUsuario: padresUsuario,
                };
                // console.log(arrayUsuarios)
                res.json(arrayUsuarios);

            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error)
        });
    }).catch(error => {
        console.log(error)
    });
}
exports.traerUsuariosEvento = async(req,res,next)=>{
    // await Usuario.findAll()
    await Ticket.findAll({
        where: {
            createdAt: {
                [Op.gte]: moment().subtract(1, 'days').toDate()
            }
        }
    }).then(async ticket =>{
        console.log(ticket)
        var arrayUsuariosE = [];
        for(var i = 0; i< ticket.length; i++){
           var usuario = await Usuario.findOne({
                where: {
                    id: ticket[i].usuarioId
                }
            });
            var ticketProducto = await TicketProducto.findOne({
                where: {
                    id_ticket: ticket[i].id
                }
            });
            var producto = await Producto.findOne({
                where: {
                    id: ticketProducto.id_producto
                }
            });
            arrayUsuariosE.push({
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.email,
                celular: usuario.celular,
                customerTicketId: ticket[i].customerTicketId,
                statusTicket: ticket[i].statusTicket,
                monto: ticket[i].monto,
                producto: producto.nombreProducto
            })
        }
        res.json(arrayUsuariosE)
    }).catch(error => {
        console.log(error)
    });
}

exports.getUsuarioFromEmail = async (req,res,next)=> {
    await funcionesUsuarios.verificarUsuarioExistente(req.params.email)
        .then(usuario => {
            res.json(usuario)
        })
}

function getNinoMembresia(ninoUserId){
    return NinosMembresia.findOne({
        where: {
            id_nino: ninoUserId
        }
    }).then(ninoMembresia => {
        return ninoMembresia.dataValues;
    }).catch(error => {
        console.log(error)
    });
}
function windowGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
  }

// Función para crear usuario temporal
exports.userTemporal = async(req,res) =>{
    console.log("ejecutando")
    var IdUsuarioPersonalizado = await windowGuid();
    var password = 12345678;
    var nuevaPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    var tipoUsuario = 3;
    var nombres = "Publico";
    var apellidos = "General";
    var celular = "1234567890";
    var email = "publico@general.com";
    return await Usuarios.create({
        "nombres": nombres,
        "apellidos": apellidos,
        "celular": celular,
        "email": email,
        "password": nuevaPassword,
        "idTipoUsuario": tipoUsuario,
        "idUsuarioPersonalizado": IdUsuarioPersonalizado,
    }).then(usuario =>{
        res.json(usuario.idUsuarioPersonalizado)
    })    
}

exports.updateUserTemporal = async(req,res, next)=>{
    console.log(req.body)
    var email = req.body.emailPadre;
    var celular = req.body.telefonoPadre;
    var nombres = req.body.nombrePadre;
    var apellidos = req.body.apellidoPadre;
    var idUsuario = req.body.idUsuario;
    //var nuevaPassword = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    await Usuario.update({
        email:email,
        celular:celular,
        nombres:nombres,
        apellidos:apellidos,
    }, {
        where: {
        idUsuarioPersonalizado: idUsuario,
        },
    }).then(usuarioActualizado =>{
        console.log("usuarioAc: ")
        console.log(usuarioActualizado)
        //res.redirect(URLMAGIC);
    }).catch(error => {
        console.log(error);
    });
}
exports.getUsuarioFromIdP = async(req,res,next) => {
    console.log("llegando")
    console.log(req.params.user_idP);
    var usuario = await funcionesUsuarios.getdataUsuario(req.params.user_idP)
    console.log(usuario)
    res.json(usuario);
}