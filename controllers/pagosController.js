const envConfig = require("../config.js");
const stripe = require('stripe')(envConfig.env == "dev" ? envConfig.stripe.private_developer_key : envConfig.stripe.private_production_key);
// const stripe = require('stripe')('clave');
// const stripe = require('stripe')('clave');

const Ticket = require('../database/models/Ticket');
const Usuario = require('../database/models/Usuarios');
const Producto = require('../database/models/Producto');
const Carrito = require('../database/models/Carrito');
const NinosUser = require('../database/models/NinosUser');
const NinosMembresia = require('../database/models/NinosMembresia');
const Membresia = require('../database/models/Membresia');
const PadresUser = require('../database/models/PadresUser');
const TicketProducto = require('../database/models/TicketProducto');
const TarjetasDigitales = require('../database/models/TarjetasDigitales');
const { createTicketProducto } = require("../repository/ticketProductoRepository");
const funcionesCarrito = require('../functions/funcionesCarrito');
const StripeRepository = require('../repository/stripeRepository');
const ninos = require("../functions/ninos");
const axios = require("axios");
//pagosController.js
const URLMAGICCRM = require('../variableGlobal/config');
const URLMAGIC = URLMAGICCRM.URLMAGICCRM;
const URLCRMDEV = URLMAGICCRM.URLCRMDEV;
const {sendEmail} = require('../functions/sendEmail');
const boom = require("@hapi/boom");
const TallaProduct = require('../database/models/TallaProduct');
const ColorProduct = require('../database/models/ColorProduct');
const carritoRepository = require('../repository/carritoRepository');
exports.crearPago = async(req,res, next)=>{
    // console.log(req.file, req.body);
    // console.log("id del producto: ", req.body.idProducto)
    
    try{
        console.log(req.body)
        await Producto.findAll({
            where: {
                id: req.body.idProducto
            }
        }).then(async producto => {



            let precio = producto[0].dataValues.precio;
            let nuevoPrecio = precio * 100;
            let titulo = producto[0].dataValues.nombreProducto;
            const customer = await stripe.customers.create({
                email: req.body.email,
                source: req.body.stripeToken
            })
            await stripe.charges.create({
                amount: nuevoPrecio,
                currency: 'mxn',
                customer: customer.id,
                description: titulo
            }).then(async charge => {
                // console.log("customer")
                // console.log(charge.customer)
                // console.log("charge: ")
                // console.log(charge)
                // console.log("response: ")
                
                //succeeded
                if(charge.status == "succeeded"){
                    const ticket = await Ticket.create({
                        customerTicketId: charge.customer,
                        usuarioId: req.session.usuarioId,
                        statusTicket: "NoReclamado",
                    });
                    //4548 8120 4940 0004
                    res.redirect(`${URLMAGIC}/ticket/${ticket.id}`);
                }else{
                    res.redirect(`${URLMAGIC}/error-pago`)
                }
                
            }).catch(error => {
                console.log("aqui va el error: ");
                console.log(error);
            })
        })
        
    }catch(error){
        console.log("error23: ")
        console.log(error)
        res.redirect(`${URLMAGIC}/error-pago`)
    }
    
}
exports.crearPagoPasarela = async(req,res, next)=>{

    try{
        console.log("esta llegando los datos")
        console.log(req.body)
        await Usuario.findAll({
            where: {
                email: req.body.email
            }
        }).then(async usuario => {
            var IdUsuarioPersonalizado = await windowGuid();
            if(usuario[0] == undefined){
                console.log("no existe el usuario")
                await Usuario.create({
                    email: req.body.email,
                    celular: req.body.numero,
                    nombres: req.body.nombre,
                    apellidos: req.body.apellidos,
                    password: generarPassword(),
                    idTipoUsuario: 3,
                    idUsuarioPersonalizado: IdUsuarioPersonalizado,
                }).then(async usuarioNuevo =>{
                    // console.log("NuevoUsuario:")
                    // console.log(usuarioNuevo.dataValues.id);

                    

                    //creacion de todo el pago
                    var ticket = await crearPagoP(req.body.producto,req.body.email,req.body.stripeToken,usuarioNuevo.dataValues.id,req.body.nombrenino,req.body.pagoAdelantado,req.body.cantidadPago)
                    console.log(ticket)
                    res.redirect(`${URLMAGIC}/ticket/${ticket.id}`)  

                }).catch(error => {
                    console.log("errorNuevoUsuario:")
                    console.log(error);
                    res.redirect(`${URLMAGIC}/error-pago`);
                })
            }else{

                
                var ticket = await crearPagoP(req.body.producto,req.body.email,req.body.stripeToken,usuario[0].dataValues.id,req.body.nombrenino,req.body.pagoAdelantado,req.body.cantidadPago);       
                console.log(ticket)
                res.redirect(`${URLMAGIC}/ticket/${ticket.id}`)  

            }
            
        }).catch(error => {
            res.redirect(`${URLMAGIC}/error-pago`);
            console.log("errorUsuariio:")
            console.log(error);
        })

        
    }catch(error){
        console.log("error23: ")
        console.log(error)
        res.redirect(`${URLMAGIC}/error-pago`)
    }
    
}
exports.createCheckoutSession = async(req,res, next)=>{
    // console.log(req.body);

    await Usuario.findAll({
        where: {
            email: req.body.email
        }
    }).then(async usuario => {
        console.log("la primera busqueda de usuarios: ")
        console.log(usuario);
        var IdUsuarioPersonalizado = await windowGuid();
        if(usuario[0] == undefined){
            console.log("acaba de crear el usuario")
            await Usuario.create({
                email: req.body.email,
                celular: req.body.numero,
                nombres: req.body.nombre,
                apellidos: req.body.apellidos,
                password: generarPassword(),
                idTipoUsuario: 3,
                idUsuarioPersonalizado: IdUsuarioPersonalizado,
            }).then(async usuarioNuevo =>{
                console.log("el susuario que se acaba de crear aqui se muestra ahora: ")
                console.log(usuarioNuevo)

                let idS = await generadorStripe(req.body.producto,req.body.pagoAdelantado,req.body.cantidadPago,usuarioNuevo.dataValues.id,req.body.nombrenino);    
                // console.log("idS")
                // console.log(idS)
                // res.json(idS);
                //creacion de todo el pago
                // var ticket = await crearPagoP(req.body.producto,req.body.email,req.body.stripeToken,usuarioNuevo.dataValues.id,req.body.nombrenino,req.body.pagoAdelantado,req.body.cantidadPago)
                // console.log(ticket)
                // res.redirect(`${URLMAGIC}/ticket/${ticket.id}`)  

            }).catch(error => {
                console.log("errorNuevoUsuario:")
                console.log(error);
                res.redirect(`${URLMAGIC}/error-pago`);
            })
        }else{
            console.log("ya existia el usuario")
            let idS = await generadorStripe(req.body.producto,req.body.pagoAdelantado,req.body.cantidadPago,usuario[0].dataValues.id,req.body.nombrenino);
            // console.log("idS")
            // console.log(idS)
            // res.json(idS);
            // var ticket = await crearPagoP(req.body.producto,req.body.email,req.body.stripeToken,usuario[0].dataValues.id,req.body.nombrenino,req.body.pagoAdelantado,req.body.cantidadPago);       
            // console.log(ticket)
            // res.redirect(`${URLMAGIC}/ticket/${ticket.id}`)  

        }
        
    }).catch(error => {
        res.redirect(`${URLMAGIC}/error-pago`);
        console.log("errorUsuariio:")
        console.log(error);
    })

    
}
exports.seCreoPago = async(req,res, next)=>{
    console.log("se creo el pago")
    console.log(req);
}

async function generadorStripe(productoNuev,pagoAdelantado,cantidadPago,usuarioId,nombrenino){
    // console.log("productoNuev")
    // console.log(productoNuev)
    return await Producto.findAll({
        where: {
            id: productoNuev
        }
    }).then(async producto => {
        console.log("encontro el producto")
        let precio = producto[0].dataValues.precio;
        
        let imagenProd = URLCRMDEV+producto[0].dataValues.urlImagenPost;
        let titulo = producto[0].dataValues.nombreProducto;
       
        if(cantidadPago == "pagototal"){
            var nuevoPrecio2 = precio;
            var nuevoPrecio = nuevoPrecio2 * 100;
            var faltante = 0;
        }else if(cantidadPago == "pagaradelanto"){
            // console.log(pagoAdelantado)
            var nuevoPrecio2 = pagoAdelantado;
            var nuevoPrecio = nuevoPrecio2 * 100;
            var faltante = precio - pagoAdelantado;


        }
        console.log("aqui enseñamos el usuario id: ");
        console.log(usuarioId)
        // return await Ticket.create({
        //     customerId: "aqui va el id customer",
        //     usuarioId: usuarioId,
        //     statusTicket: "NoReclamado",
        //     monto: nuevoPrecio2,
        //     faltante: faltante,
        //     estado: "no-liquidado",
        // }).then(async ticket =>{
        //     console.log("creo el ticket")
        //     console.log(ticket.dataValues.id);
            // console.log(producto[0].dataValues.idTipoProducto)
        

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            metadata: {
                order_id: "casitadelimon",
                usuarioId: usuarioId,
                montoPagar: nuevoPrecio2,
                faltante: faltante,
                idTipoProducto: producto[0].dataValues.idTipoProducto,
                idProducto: producto[0].dataValues.id,
                precio_unitario: producto[0].dataValues.precio,
                nombrenino: nombrenino,
                // idTicket: ticket.dataValues.id,
            },
            line_items: [
              {
                price_data: {
                  currency: 'mxn',
                  product_data: {
                    name: titulo,
                    images: [`${imagenProd}`],
                  },
                  unit_amount: nuevoPrecio,
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `${URLCRMDEV}/ticket`,
            cancel_url: `${URLCRMDEV}/cancel.html`,
            // success_url: `${URLMAGIC}/success.html`,
            // cancel_url: `${URLMAGIC}/cancel.html`,
          });
          console.log({ id: session.id })
          return { id: session.id };
        // }).catch(error =>{
        //     console.log(error)
        // });
        
    }).catch(error =>{
        console.log(error)
        console.log("error no existe el producto")
    });
    
    //   res.json({ id: session.id });
}

async function crearPagoP(productoNuev,email,stripeToken,idUsuarioNuevo,nombrenino,pagoAdelantado,cantidadPago){
    console.log("productoNuev: ")
    console.log(productoNuev);
    return await Producto.findAll({
        where: {
            id: productoNuev
        }
    }).then(async producto => {
        // console.log("aqui llegamos")
        // console.log(producto)
        let precio = producto[0].dataValues.precio;
        
        let titulo = producto[0].dataValues.nombreProducto;
        if(cantidadPago == "pagototal"){
            var nuevoPrecio = precio * 100;
        }else if(cantidadPago == "pagaradelanto"){
            console.log(pagoAdelantado)
            var nuevoPrecio = pagoAdelantado * 100;
        }
        
        const customer = await stripe.customers.create({
            email: email,
            source: stripeToken
        })
        return await stripe.charges.create({
            amount: nuevoPrecio,
            currency: 'mxn',
            customer: customer.id,
            description: titulo
        }).then(async charge => {
            // console.log(charge)
            //succeeded
            if(charge.status == "succeeded"){
                // console.log("pagoAdelantado");
                // console.log(pagoAdelantado)
                if(cantidadPago == "pagototal"){
                    var faltante = 0;
                    var montoPagar = precio;
                }else if(cantidadPago == "pagaradelanto"){
                    var faltante = precio - pagoAdelantado;
                    var montoPagar = pagoAdelantado;
                }
                return await Ticket.create({
                    customerTicketId: charge.customer,
                    usuarioId: idUsuarioNuevo,
                    statusTicket: "NoReclamado",
                    monto: montoPagar,
                    faltante: faltante,
                }).then(async ticket =>{
                    // console.log(ticket.dataValues.id)
                    if(producto[0].dataValues.idTipoProducto == 8){
                        
                        //aqui se retorna en caso de que el producto sea un cumpleños
                        // console.log(ticket.dataValues)
                        
                        var datosTP = {
                            id_ticket: ticket.dataValues.id,
                            id_producto: producto[0].dataValues.id,
                            cantidad: 1,
                            precio_unitario: producto[0].dataValues.precio,
                        }
                        var ticketProducto = await createTicketProducto(datosTP);
                        
                        // return ticket.dataValues;
                        return ticketProducto.dataValues;
                    }else{
                        return await NinosUser.create({
                            nombre: nombrenino,
                            id_user: idUsuarioNuevo,
                            horas_globales: 0,
                            status: 0,
    
                        }).then(async ninoUser => {
    
                            // console.log(ninoUser.dataValues.id)
                            // console.log(producto[0].dataValues.id)
                            // console.log(producto[0].dataValues.idTipoProducto)
                            if(producto[0].dataValues.idTipoProducto == 7){
                                var nuevoIdProducto = 63;
                            }else{
                                var nuevoIdProducto = producto[0].dataValues.id;
                            }
                            console.log(nuevoIdProducto)
                            return await Membresia.findAll({
                                where: {
                                    id_producto: nuevoIdProducto
                                }
                            }).then(async membresia =>{
                                // console.log(membresia)
                                var dt = new Date();
                                var anio = dt.getYear();
                                var valorRandom = windowGuid2();
                                var nuevoSku = membresia[0].dataValues.prefijo+anio+valorRandom;
                                // console.log(membresia[0].dataValues.prefijo)
                                // console.log(anio)
                                // console.log(valorRandom)
                                var fecha_inicio = moment().format();
                                var fecha_vencimiento = moment().add(membresia[0].dataValues.total_dias, 'days').format();
                               return await NinosMembresia.create({
                                    id_nino: ninoUser.dataValues.id,
                                    id_membresia: membresia[0].dataValues.id,
                                    fecha_inicio: fecha_inicio,
                                    fecha_vencimiento: fecha_vencimiento,
                                    sku_membresia: nuevoSku,
                                    status: 0,
                                }).then(async ninoMembresia => {
                                    // console.log("El niño menbresia")
                                    // console.log(ninoMembresia)
                                    // res.redirect(`http://localhost:3003/ticket`);
                                    // console.log(ticket.dataValues)
                                    
                                    var datosTP = {
                                        id_ticket: ticket.dataValues.id,
                                        id_producto: producto[0].dataValues.id,
                                        cantidad: 1,
                                        precio_unitario: producto[0].dataValues.precio,
                                    }
                                    var ticketProducto = await createTicketProducto(datosTP);
                                    
                                    return ticketProducto.dataValues;
                                    // return ticket.dataValues;
                                }).catch(error => {
                                    console.log("error al crear niño membresia")
                                    console.log(error)
                                });
                            }).catch(error => {
                                console.log("error en menbresia")
                                console.log(error)
                            });
                           
                            
                        }).catch(error => {
                            console.log("fallo el niño user");
                        })
                    }
                    
                    
                }).catch(error => {

                });
                
            }else{
                res.redirect(`${URLMAGIC}/error-pago`)
            }
            
        }).catch(error => {
            console.log("aqui va el error: ");
            console.log(error);
        })
    })
}
function pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}
function getTicketById(){
    
}
exports.crearPagoCarrito = async(req,res, next)=>{

    try{
        var sumaPrecio = 0;
        await Carrito.findAll({
            where: {
                idUsuario: req.session.usuarioId
                // idUsuario: req.body.idUsuario
            }
        }).then(async carrito => {
            // console.log(carrito)
            // res.json(carrito)
            carrito.map((carro)=>{
                sumaPrecio += carro.precioProducto
            })

            let nuevoPrecio = sumaPrecio * 100;
            let titulo = "Compra Carrito";
            const customer = await stripe.customers.create({
                email:req.body.strupeEmail,
                source: req.body.stripeToken
            })
            await stripe.charges.create({
                amount: nuevoPrecio,
                currency: 'mxn',
                customer: customer.id,
                description: titulo
            }).then(async charge => {

                // console.log("response: ")
                // console.log(charge)
                //succeeded
                if(charge.status == "succeeded"){
                     await Ticket.create({
                        customerTicketId: charge.customer,
                        usuarioId: req.session.usuarioId,
                        statusTicket: "NoReclamado",
                    }).then(async ticket =>{
                        await Carrito.destroy({ 
                            where: {
                                idUsuario: req.session.usuarioId
                            }
                           }).then((eliminado) =>{
                               console.log(eliminado)
                                // res.json({"mensaje": "se elimino el producto"})
                                res.redirect(`/ticket/${ticket.id}`);
                            }).catch(error => {
                                // console.log(error)
                                console.log("error en el carrito")
                            })
                    }).catch(error =>{
                        // console.log(error)
                        console.log("error en el ticket")
                    })
                    
                }else{
                    res.redirect(`${URLMAGIC}/error-pago`)
                }
                
            }).catch(error => {
                console.log("aqui va el error: ");
                // console.log(error);
            })
        }).catch(error => {
            // console.log(error)
            console.log("error al buscar carrito")
        })
        
        
    }catch(error){
        console.log("error23: ")
        // console.log(error)
        res.redirect(`${URLMAGIC}/error-pago`)
    }
    
}

exports.getTicket = async(req,res, next)=>{
    try{
        // const ticket = await Ticket.findAll({
        //     where: {
        //         usuarioId: req.session.usuarioId
        //     }
        // })
        const ticket = await Ticket.findAll({
            where: {
                usuarioId: req.session.usuarioId,
                id: req.params.ticketId
            }
        })
        const usuario = await Usuario.findAll({
            where: {
                id: req.session.usuarioId
            }
        });
        var arrayTicket = {
            nombres: usuario[0].nombres,
            apellidos: usuario[0].apellidos,
            email: usuario[0].email,
            createdAt: ticket[0].createdAt,
            customerTicketId: ticket[0].customerTicketId,
            statusTicket: ticket[0].statusTicket,

        }
        
        res.json(arrayTicket);
    }catch(error){
        // console.log(error)
        next();
    }
}

exports.crearCarrito = async(req,res, next)=>{
    console.log(req);
    var horaCumpleanios = req.body.horaCumpleanios;
    var fechaCumpleanios = req.body.fechaCumpleanios;
    var arrayCarrito;
    if(req.body.idUsuario == null){
        return res.json({message: "error no hay usuario"})
    }
    let showDetalle = null;
    if (req.body.show_detalles){
        showDetalle = JSON.parse(req.body.show_detalles);
    }
    // console.log("tipoCarrito")
    // console.log(req.body.tipoCarrito)
    console.log(showDetalle);
    
    await Carrito.findOne({
        where: {
            idUsuario: req.body.idUsuario,
            idProducto: req.body.idProducto,
        }
    }).then(async carrito => {
        await Producto.findOne({
            where: {
                id: req.body.idProducto,
            }
        }).then(async producto => {
            if(producto.urlImagenMovil == null){
                var urlImagen = producto.urlImagenPost;
            }else{
                var urlImagen = producto.urlImagenMovil;
            }

            if(req.body.horas > 0){
                var nuevoPrecio = producto.precio * req.body.horas;
            }else{
                var nuevoPrecio = producto.precio;
            }

            const cartParams = await carritoRepository.getCartParams(producto, req.body);
            
            console.log(cartParams);

            if(carrito == null || req.body.action == "create"){
                await Carrito.create({
                    idProducto: req.body.idProducto,
                    nombreProducto: cartParams ? cartParams[0] : producto.nombreProducto,
                    urlImagen: urlImagen,
                    precioProducto: cartParams ? cartParams[1] : nuevoPrecio,
                    idUsuario: req.body.idUsuario,
                    cantidad: req.body.cantidad,
                    idColor: req.body.id_color,
                    idTalla: req.body.id_talla,
                    childName: req.body.child_name,
                    horas: req.body.horas,
                    showDetalle: req.body.show_detalles,
                    tipoCarrito: req.body.tipoCarrito,
                    horaCumpleanios: horaCumpleanios,
                    fechaCumpleanios: fechaCumpleanios
                }).then(nuevoCarrito => {
                    console.log(nuevoCarrito)
                    res.json(nuevoCarrito);
                }).catch(error => {
                    console.log(error)
                })
            } else {
                await Carrito.update(req.body,{
                    where: {
                        id: carrito.id
                    }
                }).then(async carritoActualizado => {
                    await Carrito.findOne({
                        where: {
                            id: carrito.id
                        }
                    }).then(cart => {
                        res.json(cart)
                    })
                    
                }).catch(error => {
                    console.log(error)
                })
            }
        }).catch(error => {
            console.log(error)
        })
        
        
    }).catch(error => {
        console.log(error)
    })
}

exports.getCarrito = async(req,res, next)=>{
    var carrito = Carrito;
    var talla = TallaProduct;
    var color = ColorProduct;
    var producto = Producto;

    talla.hasMany(carrito, { foreignKey: "idTalla" });
    carrito.belongsTo(talla, { foreignKey: "idTalla" });

    color.hasMany(carrito, { foreignKey: "idColor" });
    carrito.belongsTo(color, { foreignKey: "idColor" });

    producto.hasMany(carrito, { foreignKey: "idProducto" });
    carrito.belongsTo(producto, { foreignKey: "idProducto" });
    
    await Carrito.findAll({
        include: [talla, color, producto],
        where: {
            idUsuario: req.params.idUsuario
        }
    }).then(carrito => {
        // formatearNumero(numero);
        var arrayCarro = [];
        
        var totalCarro = 0;
        for(var i = 0; i < carrito.length; i++){
            let nuevoPrecio = carrito[i].cantidad * carrito[i].precioProducto;
            let precio_format = formatearNumero(nuevoPrecio);
            totalCarro += nuevoPrecio;
            arrayCarro.push({
                id: carrito[i].id,
                idProducto: carrito[i].idProducto,
                idTipoProducto: carrito[i].producto.idTipoProducto,
                nombreProducto: carrito[i].nombreProducto,
                urlImagen: carrito[i].urlImagen,
                precioProducto: nuevoPrecio,
                precio_format: precio_format,
                precio_unitario: carrito[i].precioProducto,
                idUsuario: carrito[i].idUsuario,
                cantidad: carrito[i].cantidad,
                child_name: carrito[i].childName,
                color: {
                    id_color: carrito[i].idColor ? carrito[i].idColor : 0,
                    label: carrito[i].idColor ? carrito[i].color_product.color : "none"
                },
                talla: {
                    id_talla: carrito[i].idTalla ? carrito[i].idTalla : 0,
                    label: carrito[i].idTalla ? carrito[i].talla_product.talla : "none"
                },
                showDetails: carrito[i].showDetalle     
            })
            
        }
        let totalCarro_format = formatearNumero(totalCarro);
        var arrayFinal = {
            totalCarro: totalCarro,
            totalCarro_format: totalCarro_format,
            arrayCarro: arrayCarro,
            
        };
        // arrayCarro.push({
        //     totalCarro: totalCarro
        // })
            
        
        res.json(arrayFinal)
    }).catch(error => {
        console.log(error)
    })
}
exports.getCarritoSistema = async(req,res, next)=>{
    var carrito = Carrito;
    var talla = TallaProduct;
    var color = ColorProduct;
    var producto = Producto;

    talla.hasMany(carrito, { foreignKey: "idTalla" });
    carrito.belongsTo(talla, { foreignKey: "idTalla" });

    color.hasMany(carrito, { foreignKey: "idColor" });
    carrito.belongsTo(color, { foreignKey: "idColor" });

    producto.hasMany(carrito, { foreignKey: "idProducto" });
    carrito.belongsTo(producto, { foreignKey: "idProducto" });
    console.log();
    await Carrito.findAll({
        include: [talla, color, producto],
        where: {
            idUsuario: req.params.idUsuario,
            tipoCarrito: req.body.tipoCarrito
        }
    }).then(carrito => {
        // formatearNumero(numero);
        var arrayCarro = [];
        
        var totalCarro = 0;
        for(var i = 0; i < carrito.length; i++){
            let nuevoPrecio = carrito[i].cantidad * carrito[i].precioProducto;
            let precio_format = formatearNumero(nuevoPrecio);
            totalCarro += nuevoPrecio;
            arrayCarro.push({
                id: carrito[i].id,
                idProducto: carrito[i].idProducto,
                idTipoProducto: carrito[i].producto.idTipoProducto,
                nombreProducto: carrito[i].nombreProducto,
                urlImagen: carrito[i].urlImagen,
                precioProducto: nuevoPrecio,
                precio_format: precio_format,
                precio_unitario: carrito[i].precioProducto,
                idUsuario: carrito[i].idUsuario,
                cantidad: carrito[i].cantidad,
                child_name: carrito[i].childName,
                horas: carrito[i].horas,
                horaCumpleanios: carrito[i].horaCumpleanios,
                fechaCumpleanios: carrito[i].fechaCumpleanios,
                color: {
                    id_color: carrito[i].idColor ? carrito[i].idColor : 0,
                    label: carrito[i].idColor ? carrito[i].color_product.color : "none"
                },
                talla: {
                    id_talla: carrito[i].idTalla ? carrito[i].idTalla : 0,
                    label: carrito[i].idTalla ? carrito[i].talla_product.talla : "none"
                },
                showDetails: carrito[i].showDetalle     
            })
            
        }
        let totalCarro_format = formatearNumero(totalCarro);
        var arrayFinal = {
            totalCarro: totalCarro,
            totalCarro_format: totalCarro_format,
            arrayCarro: arrayCarro,
            
        };
        // arrayCarro.push({
        //     totalCarro: totalCarro
        // })
            
        
        res.json(arrayFinal)
    }).catch(error => {
        console.log(error)
    })
}
exports.deleteCarrito = async(req,res, next)=>{
        await funcionesCarrito.getCarritofromId(req.params.idCarrito)
        .then(async carrito => {
            console.log(carrito)
            // return res.json(carrito);
            if(carrito != null){
                await Carrito.destroy({ 
                    where: {
                        id: req.params.idCarrito
                    }
                }).then(async eliminado =>{
                    await funcionesCarrito.getCarritofromUsuarioId(carrito.idUsuario)
                    .then(async carritoArray => {
                            
                        var arrayCarro = [];
        
                        var totalCarro = 0;
                        for(var i = 0; i < carritoArray.length; i++){
                            let nuevoPrecio = carritoArray[i].cantidad * carritoArray[i].precioProducto;
                            let precio_format = formatearNumero(nuevoPrecio);
                            totalCarro += nuevoPrecio;
                            arrayCarro.push({
                                id: carritoArray[i].id,
                                idProducto: carritoArray[i].idProducto,
                                nombreProducto: carritoArray[i].nombreProducto,
                                urlImagen: carritoArray[i].urlImagen,
                                precioProducto: nuevoPrecio,
                                precio_format: precio_format,
                                precio_unitario: carritoArray[i].precioProducto,
                                idUsuario: carritoArray[i].idUsuario,
                                cantidad: carritoArray[i].cantidad,
                            })
                            
                        }
                        let totalCarro_format = formatearNumero(totalCarro);
                        var arrayFinal = {
                            totalCarro: totalCarro,
                            totalCarro_format: totalCarro_format,
                            arrayCarro: arrayCarro,
                            
                        };
                            
                        
                        res.json(arrayFinal)
                            
                    }).catch(error => {
                        console.log(error)
                    })
                        
                })
            }else{
                res.json({message: "no existe el carrito"})
            }
                
        }).catch(error => {
            console.log(error);
        })
   
}

exports.eliminarProductoCarro = async(req,res, next)=>{
    
    try{
        await Usuario.findAll({
            where:{
                email: req.body.usuario
            }
        }).then(async usuario => {
            await Carrito.findAll({
                where:{
                    id: req.params.IdCarrito,
                    idUsuario: usuario[0].id,
                }
            }).then(async carrito => {
                // res.json(carrito[0].id)
                await Carrito.destroy({ 
                    where: {
                        id: carrito[0].id
                    }
                   }).then((eliminado) =>{
                    //    console.log(eliminado)
                        res.json({"mensaje": "se elimino el producto"})
                    })
            }).catch(error =>{
                // console.log(error)
                res.json({"mensaje": "no existe"});
            });
        })
        
    


        // res.json(carrito)
    }catch(error){
        // console.log(error)
    }
}

exports.webhookPago = async(req,res, next)=>{
    console.log("metadatos")
    // console.log(req.body.data)
    console.log(req.body.data.object.metadata)
    const payload = req.body;
    // const sig = req.headers['stripe-signature'];
    // const endpointSecret = "whsec_NUINyY16i9eIv2fZb3jxB37NVke4XVbq";
    // let event;
  
    try {
        // const payload = {
        //     id: 'evt_test_webhook',
        //     object: 'event',
        //   };
          
          const payloadString = JSON.stringify(payload, null, 2);
          const secret = 'whsec_NUINyY16i9eIv2fZb3jxB37NVke4XVbq';
                          
          
          const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
          });
          
          const event = stripe.webhooks.constructEvent(payloadString, header, secret);
          console.log(event)
          // Do something with mocked signed event
        //   expect(event.id).to.equal(payload.id);
        res.json({received: true});
    } catch (err) {
        console.log(err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    res.status(200);
}


function generarPassword() {
    return 'xx4xxxyxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
  }

function windowGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}
function windowGuid2() {
    return 'xxxxx-xx4x-yxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}

exports.createCheckoutSession2 = async (req,res,next)=>{

    var IdUsuarioPersonalizado = await windowGuid();

    if(req.body.entregaProducto == undefined){
        console.log("estas en la pasarela de la membresia")
        var datosUsuarios = {
            email: req.body.email,
            celular: req.body.numero,
            nombres: req.body.nombre,
            apellidos: req.body.apellidos,
            password: generarPassword(),
            idTipoUsuario: 3,
            idUsuarioPersonalizado: IdUsuarioPersonalizado,
            
        };
        var envio = false;
    }else{
        console.log("estas en la pasarela de los productos")
        if(req.body.entregaProducto == "entregamagic"){
            var datosUsuarios = {
                email: req.body.email,
                celular: req.body.numero,
                nombres: req.body.nombre,
                apellidos: req.body.apellidos,
                password: generarPassword(),
                idTipoUsuario: 3,
                idUsuarioPersonalizado: IdUsuarioPersonalizado,
            };
            var envio = false;
        }else{
            var datosUsuarios = {
                email: req.body.email,
                celular: req.body.numero,
                nombres: req.body.nombre,
                apellidos: req.body.apellidos,
                password: generarPassword(),
                idTipoUsuario: 3,
                idUsuarioPersonalizado: IdUsuarioPersonalizado,
                calle: req.body.calle,
                numero_int: req.body.numeroInterior,
                referencia: req.body.referencia,
                colonia: req.body.colonia,
                codigo_postal: req.body.codigoPostal,
                ciudad: req.body.ciudad,
                estado: req.body.estado,
            };
            var envio = true;
        }
    }

    await Usuario.findAll({
        where: {
            email: req.body.email
        }
    }).then(async usuario => {
        // console.log("la primera busqueda de usuarios: ")
        // console.log(usuario);
        
        if(usuario[0] == undefined){
            console.log("acaba de crear el usuario")
            await Usuario.create(datosUsuarios).then(async usuarioNuevo =>{
                console.log("el susuario que se acaba de crear aqui se muestra ahora: ")
                // console.log(usuarioNuevo)
                let nombreUsuario = usuarioNuevo.dataValues.nombres +" "+ usuarioNuevo.dataValues.apellidos;
                let idS = await generandoPagoStripe(req.body.producto,req.body.pagoAdelantado,req.body.cantidadPago,usuarioNuevo.dataValues.id,req.body.nombrenino,usuarioNuevo.dataValues.email,nombreUsuario);    
                res.json(idS);

            }).catch(error => {
                console.log("errorNuevoUsuario:")
                console.log(error);
                res.redirect(`${URLMAGIC}/error-pago`);
            })
        }else{
            console.log("ya existia el usuario")
            if(envio){
                 await Usuario.update(
                    { 
                        calle: req.body.calle,
                        numero_int: req.body.numeroInterior,
                        referencia: req.body.referencia,
                        colonia: req.body.colonia,
                        codigo_postal: req.body.codigoPostal,
                        ciudad: req.body.ciudad,
                        estado: req.body.estado,
                     },
                    {
                      where: {
                        id: usuario[0].dataValues.id,
                      },
                    }
                  )
                    .then(async (usuarioActualizado) =>{
                        let nombreUsuario = usuario[0].dataValues.nombres +" "+ usuario[0].dataValues.apellidos;
                        let idS = await generandoPagoStripe(req.body.producto,req.body.pagoAdelantado,req.body.cantidadPago,usuario[0].dataValues.id,req.body.nombrenino,usuario[0].dataValues.email,nombreUsuario);
                        res.json(idS);
                    })
                    .catch(error => {
                        console.log(error)
                    });
            }else{
                let nombreUsuario = usuario[0].dataValues.nombres +" "+ usuario[0].dataValues.apellidos;
                let idS = await generandoPagoStripe(req.body.producto,req.body.pagoAdelantado,req.body.cantidadPago,usuario[0].dataValues.id,req.body.nombrenino,usuario[0].dataValues.email,nombreUsuario);
                res.json(idS);
            }
            

        }
        
    }).catch(error => {
        res.redirect(`${URLMAGIC}/error-pago`);
        console.log("errorUsuariio:")
        console.log(error);
    })

    
}
async function generandoPagoStripe(productoNuev,pagoAdelantado,cantidadPago,usuarioId,nombrenino,email,nombreUsuario){
    console.log("productoNuev: ")
    console.log(productoNuev);
    return await Producto.findAll({
        where: {
            slug: productoNuev
        }
    }).then(async producto => {
        console.log("encontro el producto")
        let precio = producto[0].dataValues.precio;
        
        let imagenProd = URLCRMDEV+producto[0].dataValues.urlImagenPost;
        let titulo = producto[0].dataValues.nombreProducto;
       
        if(cantidadPago == "pagototal"){
            var nuevoPrecio2 = precio;
            var nuevoPrecio = nuevoPrecio2 * 100;
            var faltante = 0;
        }else if(cantidadPago == "pagaradelanto"){
            // console.log(pagoAdelantado)
            var nuevoPrecio2 = pagoAdelantado;
            var nuevoPrecio = nuevoPrecio2 * 100;
            var faltante = precio - pagoAdelantado;


        }
        console.log("aqui enseñamos el usuario id: ");
        // console.log(usuarioId)
        return await Ticket.create({
            customerTicketId: "",
            usuarioId: usuarioId,
            statusTicket: "NoReclamado",
            monto: nuevoPrecio2,
            faltante: faltante,
            estado: "no-liquidado",
        }).then(async ticket =>{
            console.log("creo el ticket")
            // console.log(ticket.dataValues.id);
            // console.log(producto[0].dataValues.idTipoProducto)
            var idTicketProdSecret = await windowGuid2();
            var fecha = new Date();
            var year = fecha.getFullYear();
            idTicketProdSecret = `t-${year}`+idTicketProdSecret
            console.log("estamos apunto de crear el ticket producto")
            console.log(producto[0].dataValues.id);
            var datosTP = {
                id_ticket: ticket.dataValues.id,
                id_producto: producto[0].dataValues.id,
                cantidad: 1,
                precio_unitario: producto[0].dataValues.precio,
                idTicketProdSecret: idTicketProdSecret
            }

            return await createTicketProducto(datosTP).then(async ticketProducto => {
                console.log("creo que esto es el ticket producto")
                
                console.log("usuarioId: ",usuarioId)
                console.log("montoPagar: ",nuevoPrecio2)
                console.log("faltante: ",faltante)
                console.log("idTipoProducto: ",producto[0].dataValues.idTipoProducto)
                console.log("idProducto: ",producto[0].dataValues.id)
                console.log("precio_unitario: ",producto[0].dataValues.precio)
                console.log("nombrenino: ",nombrenino)
                console.log("idTicket: ",ticket.dataValues.id)
                console.log("email: ",email)
                console.log("nombreUsuario: ",nombreUsuario)
                console.log("idTicketProdSecret: ",ticketProducto.dataValues.idTicketProdSecret)
                console.log("horasTotales: ",producto[0].dataValues.horasTotales)
                console.log("nuevoPrecio: ",nuevoPrecio)
                
                // console.log(ticketProducto.dataValues.id)
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    metadata: {
                        usuarioId: usuarioId,
                        montoPagar: nuevoPrecio2,
                        faltante: faltante,
                        idTipoProducto: producto[0].dataValues.idTipoProducto,
                        idProducto: producto[0].dataValues.id,
                        precio_unitario: producto[0].dataValues.precio,
                        nombrenino: nombrenino,
                        idTicket: ticket.dataValues.id,
                        email: email,
                        nombreUsuario: nombreUsuario,
                        idTicketProdSecret: ticketProducto.dataValues.idTicketProdSecret,
                        horasTotales: producto[0].dataValues.horasTotales,
                    },
                    line_items: [
                      {
                        price_data: {
                          currency: 'mxn',
                          product_data: {
                            name: titulo,
                            images: [`${imagenProd}`],
                          },
                          unit_amount: nuevoPrecio,
                        },
                        quantity: 1,
                      },
                    ],
                    mode: 'payment',
                    success_url: `${URLMAGIC}/ticket/${ticketProducto.dataValues.idTicketProdSecret}`,
                    cancel_url: `${URLMAGIC}/error-pago`,
                    // success_url: `${URLMAGIC}/success.html`,
                    // cancel_url: `${URLMAGIC}/cancel.html`,
                  });
                  console.log({ id: session.id })
                  return { id: session.id };
                }).catch(error =>{
                    console.log(error)
                });
            }).catch(error => {
                console.log("error al crear el ticket producto")
                console.log(error);
            });
        
        
    }).catch(error =>{
        console.log(error)
        console.log("error no existe el producto")
    });
}

exports.pagoCompraCliente = async(req,res,next)=>{
    console.log(req.body.array[0].idUsuarioPersonalizado)

    await realizarPago(req.body);

    // console.log("este es el final")
    // await Usuario.findOne({
    //     where: {
    //         idUsuarioPersonalizado: req.body.array[0].idUsuarioPersonalizado
    //     }
    // }).then(async usuario => {
    //     await Ticket.findAll({
    //         where: {
    //            usuarioId: usuario.id 
    //         }
    //     }).then(tickets => {
    //         var arrayTickets = [];
    //         for(var i = 0; i < tickets.length; i++){

    //         }
    //         await sendEmail(usuario.email, "gracias por comprar", `esto es el tiutlo?`);
    //         res.json({mensaje:"se completo tu compra"});
    //     }).catch(error => {
    //         console.log(error);
    //     })
       
    // }).catch(error => {
    //     console.log(error);
    // })
    res.json({mensaje:"se completo tu compra"});
}

exports.generatePaymentLink = async (req, res, next) => {
    try {
        const data = req.body;

        const sessionId = await StripeRepository.getStripeCheckoutSessionId({
            title: data.title,
            price: data.price * 100
        });

        console.log(sessionId);

        const link = `https://magicplanet.club/stripe-checkout/${sessionId.id}`;        
        const shortLink = await axios.get(`https://cutt.ly/api/api.php?key=b1a43adba2bd912714615f53c61a4c4dd3a37&short=${encodeURIComponent(link)}&name=${makeid(5)}`);
        
        console.log(shortLink.data);

        res.status(200).json({
            status: res.statusCode,
            message: shortLink.data.url.shortLink
        });
    } catch (err) {
        console.log(err);
        next(boom.internal());
    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function realizarPago(bodyDatos){
    return bodyDatos.array.map(async array => {
        return await Usuario.findOne({
            where: {
                idUsuarioPersonalizado: array.idUsuarioPersonalizado
            }
        }).then(async usuario =>{
            return await Producto.findOne({
                where: {
                    slug: array.productoH
                }
            }).then(async producto => {
                
                return await Ticket.create({
                    customerTicketId: bodyDatos.codigoClip,
                    usuarioId: usuario.id,
                    statusTicket: "NoReclamado",
                    monto: array.precio,
                    faltante: 0,
                    estado: "no-liquidado",
                }).then(async ticket =>{
                    // console.log(ticket)
                    // return ticket
                    
                    var idTicketProdSecret = await windowGuid2();
                    var fecha = new Date();
                    var year = fecha.getFullYear();
                    idTicketProdSecret = `t-${year}`+idTicketProdSecret;

                    var datosTP = {
                        id_ticket: ticket.dataValues.id,
                        id_producto: producto.dataValues.id,
                        cantidad: 1,
                        precio_unitario: producto.dataValues.precio,
                        idTicketProdSecret: idTicketProdSecret
                    }
                    return await createTicketProducto(datosTP).then(async ticketProducto => {
                        
                        //aqui iria lo que va despues del webhook de stripe

                        //----------------esto se ejecutaria despues de comprobar el pago--------------
                        // console.log("producto.dataValues.id")
                        // console.log(producto.dataValues.id)
                        if(producto.dataValues.idTipoProducto == 7){
                            var idprod = 63;
                        }else{
                            var idprod = producto.dataValues.id;
                        }
                        return await Membresia.findOne({
                            where: {
                                id_producto: idprod
                            }
                        }).then(async membresia =>{
                            console.log("membresia")
                            console.log(membresia)
                            if(membresia == null){
                                if(producto.dataValues.id == 69){
                                    console.log("es entrada para el padre")
                                    var slug = await generarSlug(array.usuarioExistente);
                                    console.log("slug")
                                    console.log(slug)
                                    slug = "nuevo-padre";
                                    return await PadresUser.findOne({
                                        where:{
                                            slug: slug
                                        }

                                    }).then(async padresUSer =>{
                                        // if(padresUSer == null){
                                            console.log("no existe el padre, se creara uno")
                                            return await PadresUser.create({
                                                nombre: array.nombre,
                                                id_user: usuario.id,
                                                slug: slug,
                                                status: 0
                                            }).then(async padresUser =>{
                                                console.log("se ah creado el padre");
                                                
                                                    var mensaje = `Hola que tal tripulante, muchas gracias por tu compra, a continuación te dejamos el link del ticket de tu compra:  https://magicplanet.club/ticket/${ticketProducto.idTicketProdSecret}`;
                                                    await sendEmail(usuario.email, mensaje, `Gracias por tu compra ${usuario.nombres}`);
                                                
                                            }).catch(error => {
                                                console.log(error)
                                            });
                                        // }else{
                                        //     console.log("ya existe el padre, se actualizara")
                                        // }   
                                    }).catch(error => {
                                        console.log(error);
                                    })
                                }else{
                                    console.log("aqui se compro el cumpleaños")
                                }
                            }else{
                                
                            var dt = new Date();
                                var anio = dt.getYear();
                                var valorRandom = windowGuid2();
                                var nuevoSku = membresia.dataValues.prefijo+anio+valorRandom;

                                
                                
                                if(membresia.id == 4){
                                    // TarjetasDigitales
                                    console.log("intentaste comprar unas horas")

                                    let fecha = new Date();
                                    let codigoTarjeta = "TD-"+fecha.getFullYear() +fecha.getMonth();
                                    let codigoAleatorio = await windowGuid();
                                    codigoTarjeta = codigoTarjeta+codigoAleatorio;
                                    if(array.productoH == "horas-indefinidas"){
                                        
                                        var horasTotales = array.horasExtra;
                                    }else{
                                        var horasTotales = producto.dataValues.horasTotales;
                                    }
                                    
                                    return await TarjetasDigitales.create({
                                        tarjeta_code: codigoTarjeta,
                                        total_horas: horasTotales,
                                        id_user: usuario.id,
                                        id_user_reclamo: usuario.id,
                                        reclamada: true,
                                        horas_restantes: horasTotales
                                    }).then(async tarjetasDigitales => {
                                        console.log("se creo la tarjeta digital")
                                        
                                        return await ninos.crearNinosTablas(array.nombre,usuario.id,membresia.dataValues.id,nuevoSku,ticket.id,membresia.dataValues.total_dias).then(async ninosT => {
                                            var mensaje = `Hola que tal tripulante, muchas gracias por tu compra, a continuación te dejamos el link del ticket de tu compra:  https://magicplanet.club/ticket/${ticketProducto.idTicketProdSecret}`;
                                            await sendEmail(usuario.email, mensaje, `Gracias por tu compra ${usuario.nombres}`);
                                        }).catch(eror => error)
                                    });
                                }else{
                                    return await ninos.crearNinosTablas(array.nombre,usuario.id,membresia.dataValues.id,nuevoSku,ticket.id,membresia.dataValues.total_dias).then(async ninosT => {
                                        var mensaje = `Hola que tal tripulante, muchas gracias por tu compra, a continuación te dejamos el link del ticket de tu compra:  https://magicplanet.club/ticket/${ticketProducto.idTicketProdSecret}`;
                                        await sendEmail(usuario.email, mensaje, `Gracias por tu compra ${usuario.nombres}`);
                                    }).catch(eror => error)
                                }
                            }
                            

                        }).catch(error => {
                            console.log(error)
                        });




                        //----------------esto se ejecutaria despues de comprobar el pago--------------
                    }).catch(error => {
                        console.log(error)
                    });
                }).catch(error =>{
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            console.log(error)
        });
    });
}

function formatearNumero(numero){
    var n = new Number(numero);
    var myObj = {
      style: "currency",
      currency: "MXN"
    }
    return n.toLocaleString("mxn", myObj);
  }

function generarSlug(titulo){
    // var sinEspacios = titulo.replace(/\s/g, '');
    var sinEspacios =  titulo.replace(/\s/g, "-");
    sinEspacios = sinEspacios.toLowerCase();
    return sinEspacios;
}