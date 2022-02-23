const CarritoRepository = require("../repository/carritoRepository");
const StripeRepository = require("../repository/stripeRepository");
const UserRepository = require("../repository/usersRepository");
const TicketProductoRepository = require("../repository/ticketProductoRepository");
const funcionesUsuario = require("../functions/funcionesUsuarios");
const Producto = require("../database/models/Producto");
const funcionesGenerador = require("../functions/funcionesGenerador");
const boom = require("@hapi/boom");
const TarjetasDigitales = require("../database/models/TarjetasDigitales");
const NinosUser = require("../database/models/NinosUser");
const NinosMembresia = require("../database/models/NinosMembresia");
const Membresia = require("../database/models/Membresia");
const funcionesBancoHoras = require("../functions/funcionesBancoHoras");
const funcionesTarjetasHoras = require("../functions/funcionesTarjetasHoras");
const funcionesNinos = require("../functions/funcionesNinos");
const moment = require("moment");
const funcionesPadres = require("../functions/funcionesPadres");
const funcionesCumpleanios = require('../functions/funcionesCumpleanios');

exports.checarCarro = async (req, res, next) => {
  var dataCarro = {
    idProducto: req.body.idProducto,
    idUsuario: req.body.idUsuario,
  };
  await CarritoRepository.checarCarro(dataCarro).then((carrito) => {
    res.json(carrito);
  });
};

exports.getSessionIdByCartId = async (req, res, next) => {
  try {
    const cart = await CarritoRepository.checkOut({
      idUsuario: req.body.id_usuario,
      tipoCarrito: "undefined",
    });

    if (cart.isBoom) next(cart);

    var totalCarrito = 0;

    const items = cart.map((item, index) => {
      totalCarrito += item.precioProducto * item.cantidad;

      console.log(item);

      return {
        price_data: {
          currency: "mxn",
          product_data: {
            name: item.dataValues.nombreProducto,
            images: [
              `https://crm.magicplanet.club${item.dataValues.urlImagen}`,
            ],
          },
          unit_amount: item.dataValues.precioProducto * 100,
        },
        quantity: item.dataValues.cantidad,
      };
    });

    const client = req.body.client;
    const user = await UserRepository.getUser({
      nombres: client.name,
      celular: client.phone,
      email: client.email,
      idTipoUsuario: "cliente",
      apellidos: client.last_name,
      registroEntrada: true,
    });

    console.log(`Total Carrito: ${totalCarrito}`);
    var idTicketSecret = await windowGuid2();
    var fecha = new Date();
    var year = fecha.getFullYear();
    idTicketSecret = `tp-${year}` + idTicketSecret;

    const ticket = await CarritoRepository.createTicket({
      usuarioId: user.id,
      nuevoPrecio2: totalCarrito,
      idTicketSecret: idTicketSecret,
    });

    console.log("Ticket");
    console.log(ticket);

    if (ticket.isBoom) next(ticket);

    var idTicketProdSecret = await windowGuid2();
    var fecha = new Date();
    var year = fecha.getFullYear();
    idTicketProdSecret = `tp-${year}` + idTicketProdSecret;

    cart.map(async (item, index) => {
      var datosTP = {
        id_ticket: ticket.id,
        id_producto: item.idProducto,
        cantidad: item.cantidad,
        precio_unitario: item.precioProducto,
        idTicketProdSecret: idTicketProdSecret,
        idTalla: item.idTalla ? item.idTalla : 0,
        idColor: item.idColor ? item.idColor : 0,
      };

      const ticketP = await TicketProductoRepository.createTicketProducto(
        datosTP
      );

      console.log("TicketProducto");
      console.log(ticketP);

      if (ticketP.isBoom) next(ticketP);
    });

    const sessionId = await StripeRepository.getStripeCheckoutSessionIdByCart({
      idCarrito: req.body.id_usuario,
      items,
      userId: user.id,
      ticketId: ticket.id,
      idTicketSecret,
      success_url: `https://magicplanet.club/flutter-message/${idTicketSecret}`,
      cancel_url: "https://magicplanet.club/",
    });

    console.log("StripeSession");
    console.log(sessionId);

    res.status(200).json({
      status: res.statusCode,
      message: sessionId.id,
    });
  } catch (err) {
    next(err);
  }
};

exports.payCartSistem = async (req, res, next) => {
  console.log(req.body.cuentaAbierta);
  console.log(req.body.tipoCarrito);
  console.log("req.body.carrito");
  console.log(req.body.carrito);
  console.log("req.body.tarjetas");
  console.log(req.body.tarjetas);
  // console.log(arrayCodigosT);
  
  try {
    const cart = await CarritoRepository.checkOut({
      idUsuario: req.body.id_usuario,
      tipoCarrito: req.body.tipoCarrito,
    });

    if (cart.isBoom) next(cart);

    var totalCarrito = 0;

    const items = cart.map((item, index) => {
      totalCarrito += item.precioProducto * item.cantidad;
    });

    const user = await funcionesUsuario.getdataUsuario(req.body.id_usuario);

    var idTicketSecret = await windowGuid2();
    var fecha = new Date();
    var year = fecha.getFullYear();
    idTicketSecret = `tp-${year}` + idTicketSecret;
    if (req.body.cuentaAbierta == "true") {
      var datosTicket = {
        usuarioId: user.id,
        nuevoPrecio2: totalCarrito,
        idTicketSecret: idTicketSecret,
        customerTicketId: req.body.id_ticket,
        estado: "no-liquidado",
        cuenta_abierta: 1,
      };
    } else {
      var datosTicket = {
        usuarioId: user.id,
        nuevoPrecio2: totalCarrito,
        idTicketSecret: idTicketSecret,
        customerTicketId: req.body.id_ticket,
        estado: "liquidado",
      };
    }

    const ticket = await CarritoRepository.createTicketSystem(datosTicket);

    if (ticket.isBoom) next(ticket);

    var idTicketProdSecret = await windowGuid2();
    //var fecha = new Date();
    //var year = fecha.getFullYear();
    idTicketProdSecret = `tp-${year}` + idTicketProdSecret;

    cart.map(async (item, index) => {
      var datosTP = {
        id_ticket: ticket.id,
        id_producto: item.idProducto,
        cantidad: item.cantidad,
        precio_unitario: item.precioProducto,
        idTicketProdSecret: idTicketProdSecret,
        idTalla: item.idTalla ? item.idTalla : 0,
        idColor: item.idColor ? item.idColor : 0,
      };

      const ticketP = await TicketProductoRepository.createTicketProducto(
        datosTP
      );

      if (ticketP.isBoom) next(ticketP);

      const product = await Producto.findOne({
        where: {
          id: item.idProducto,
        },
      });

      if (product.idTipoProducto == 7) {
        for (let i = 0; i < item.cantidad; i++) {
          let fecha = new Date();
          let codigoTarjeta = "TD-" + fecha.getFullYear() + fecha.getMonth();
          let codigoAleatorio = await funcionesGenerador.windowGuid();
          codigoTarjeta = codigoTarjeta + codigoAleatorio;
          if (item.horas > 0) {
            var total_horas = item.horas;
            if (product.slug == "horas-indefinidas") {
              var tarjetaHoras = await funcionesTarjetasHoras.crearTarjetaDigital(
                codigoTarjeta,
                total_horas,
                user.id,
                0,
                0
              );
              var dt = new Date();
              var anio = dt.getYear();
              var valorRandom = await funcionesGenerador.windowGuid2();
              var nuevoSku = "V-" + anio + valorRandom;
              var nombreNino = item.childName;
              var ninoEncontrado = await funcionesNinos.findNinoByName(nombreNino);
              if(ninoEncontrado == null){
                var ninos = await funcionesNinos.ninoCreate(user.id, nombreNino);
                console.log(ninos);
                var data = {
                  id_nino: ninos.id,
                  id_membresia: 4,
                  sku_membresia: nuevoSku,
                  status: 1,
                  total_dias: 365,
                };

                var ninosMembresias = await funcionesNinos.ninoMembresiaCreate(
                  data
                );

                var data = {
                  id_user_reclamo: user.id,
                  reclamada: 1,
                  id_nino_membresia: ninosMembresias.id,
                  tarjeta_code: tarjetaHoras.tarjeta_code,
                };
                var tarjetaActualizada = await funcionesTarjetasHoras.actualizarTarjeta(
                  data
                );

                var bancoHoras = await funcionesBancoHoras.getBancoHoras(
                  ninosMembresias.sku_membresia
                );
                if (bancoHoras == null) {
                  var data = {
                    id_user: user.id,
                    total_horas: 0,
                    horas_restantes: 0,
                    sku_membresia: nuevoSku,
                    horas_extra: tarjetaHoras.total_horas,
                  };
                  var bancoCreado = await funcionesBancoHoras.crearBancoHoras(
                    data
                  );
                  console.log(bancoCreado);
                } else {
                  var nuevaHoras =
                    parseInt(tarjetaHora.total_horas) +
                    parseInt(bancoHoras.horas_extra);
                  var data = {
                    horas: nuevaHoras,
                    id_bancoHoras: bancoHoras.id,
                  };
                  var bacoActualizado = await funcionesBancoHoras.actualizarBancoHoras(
                    data
                  );
                }
              }else{
                
                var ninosMembresias = await funcionesNinos.findNinoMembresiaById(ninoEncontrado.id)
                var data = {
                  id_user_reclamo: user.id,
                  reclamada: 1,
                  id_nino_membresia: ninosMembresias.id,
                  tarjeta_code: tarjetaHoras.tarjeta_code,
                };
                var tarjetaActualizada = await funcionesTarjetasHoras.actualizarTarjeta(
                  data
                );
                var bancoHoras = await funcionesBancoHoras.getBancoHoras(
                  ninosMembresias.sku_membresia
                );
                if (bancoHoras == null) {
                  console.log("no existe este banco de horas, checar el error")
                }else{
                    var nuevaHoras =
                    parseInt(tarjetaHoras.total_horas) +
                    parseInt(bancoHoras.horas_extra);
                    var data = {
                      horas: nuevaHoras,
                      id_bancoHoras: bancoHoras.id,
                    };
                    var bacoActualizado = await funcionesBancoHoras.actualizarBancoHoras(
                      data
                    );
                }
              }
              
            }
          } else {
            var total_horas = product.horasTotales;
            var tarjetaHoras = await funcionesTarjetasHoras.crearTarjetaDigital(
              codigoTarjeta,
              total_horas,
              user.id,
              0,
              0
            );
          }

          // console.log(tarjetaDigital)
        }
      } else if (product.idTipoProducto == 6) {
        var ninoUser = await NinosUser.create({
          nombre: item.childName,
          id_user: user.id,
          horas_globales: 24,
          status: 0,
        });
        var membresia = await Membresia.findOne({
          where: {
            id_producto: product.id,
          },
        });
        var dt = new Date();
        var anio = dt.getYear();
        var valorRandom = await windowGuid2();
        var nuevoSku = membresia.prefijo + anio + valorRandom;
        var fecha_inicio = moment().format();
        var fecha_vencimiento = moment()
          .add(membresia.total_dias, "days")
          .format();
        var ninoMembresia = await NinosMembresia.create({
          id_nino: ninoUser.id,
          id_membresia: membresia.id,
          fecha_inicio: fecha_inicio,
          fecha_vencimiento: fecha_vencimiento,
          sku_membresia: nuevoSku,
          status: 0,
        });
        var datos = {
          id_user: user.id,
          total_horas: membresia.horas_globales,
          horas_restantes: membresia.horas_globales,
          sku_membresia: ninoMembresia.sku_membresia,
          horas_extra: 0,
          deuda_horas: 0,
        };
        await funcionesBancoHoras.crearBancoHoras(datos);
      } else if (product.idTipoProducto == 10) {
        const data = {
          idTicket: ticket.id,
          cartItem: item,
          idProducto: product.id,
        };
        await CarritoRepository.saveShowFromCart(
          data,
          JSON.parse(item.showDetalle)
        );
      } else if (product.idTipoProducto == 9) {
        var nombreNino = item.childName;
        var slug = "nuevo-padre";
        var dataPadre = {
          nombre: nombreNino,
          id_user: user.id,
          slug: slug,
          status: 1,
        };
        var padres = await funcionesPadres.createPadreUser(dataPadre);
      }
    });

    await CarritoRepository.destroyAllCart(
      req.body.id_usuario,
      req.body.tipoCarrito
    );
    res.json({
      message: ticket.idTicketSecret,
    });
    // const sessionId = await StripeRepository.getStripeCheckoutSessionIdByCart({
    //   idCarrito: req.body.id_usuario,
    //   items,
    //   userId: user.id,
    //   ticketId: ticket.id,
    //   idTicketSecret
    // });

    // console.log(sessionId);
  } catch (error) {
    console.log(error);
  }
};
exports.payCartSistem2 = async (req, res, next) => {
  console.log(req.body.cuentaAbierta);
  console.log(req.body.tipoCarrito);
  console.log("req.body.carrito");
  console.log(req.body.carrito);
  console.log("req.body.tarjetas");
  console.log(req.body.tarjetas);
  // console.log(arrayCodigosT);
  
  try {

    // const cart = await CarritoRepository.checkOut({
    //   idUsuario: req.body.id_usuario,
    //   tipoCarrito: req.body.tipoCarrito,
    // });
    const cart = req.body.carrito.arrayCarro;
    var tarjetasD = req.body.tarjetas;
    // if (cart.isBoom) next(cart);

    var totalCarrito = 0;

    const items = cart.map((item, index) => {
      totalCarrito += item.precio_unitario * item.cantidad;
    });

    const user = await funcionesUsuario.getdataUsuario(req.body.id_usuario);

    var idTicketSecret = await windowGuid2();
    var fecha = new Date();
    var year = fecha.getFullYear();
    idTicketSecret = `tp-${year}` + idTicketSecret;
    if (req.body.cuentaAbierta == "true") {
      var datosTicket = {
        usuarioId: user.id,
        nuevoPrecio2: totalCarrito,
        idTicketSecret: idTicketSecret,
        customerTicketId: req.body.id_ticket,
        estado: "no-liquidado",
        cuenta_abierta: 1,
      };
    } else {
      var datosTicket = {
        usuarioId: user.id,
        nuevoPrecio2: totalCarrito,
        idTicketSecret: idTicketSecret,
        customerTicketId: req.body.id_ticket,
        estado: "liquidado",
      };
    }

    const ticket = await CarritoRepository.createTicketSystem(datosTicket);

    if (ticket.isBoom) next(ticket);

    var idTicketProdSecret = await windowGuid2();
    //var fecha = new Date();
    //var year = fecha.getFullYear();
    idTicketProdSecret = `tp-${year}` + idTicketProdSecret;

    cart.map(async (item, index) => {
      var datosTP = {
        id_ticket: ticket.id,
        id_producto: item.idProducto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        idTicketProdSecret: idTicketProdSecret,
        idTalla: item.idTalla ? item.idTalla : 0,
        idColor: item.idColor ? item.idColor : 0,
      };

      const ticketP = await TicketProductoRepository.createTicketProducto(
        datosTP
      );

      if (ticketP.isBoom) next(ticketP);

      const product = await Producto.findOne({
        where: {
          id: item.idProducto,
        },
      });

      if (product.idTipoProducto == 7) {
        console.log("aqui va 7")
        for (let i = 0; i < item.cantidad; i++) {
          let fecha = new Date();
          let codigoTarjeta = "TD-" + fecha.getFullYear() + fecha.getMonth();
          let codigoAleatorio = await funcionesGenerador.windowGuid();
          codigoTarjeta = codigoTarjeta + codigoAleatorio;
          if (item.horas > 0) {
            var total_horas = item.horas;
            if (product.slug == "horas-indefinidas") {
              var tarjetaHoras = await funcionesTarjetasHoras.crearTarjetaDigital(
                codigoTarjeta,
                total_horas,
                user.id,
                0,
                0
              );
              var dt = new Date();
              var anio = dt.getYear();
              var valorRandom = await funcionesGenerador.windowGuid2();
              var nuevoSku = "V-" + anio + valorRandom;
              var nombreNino = item.child_name;
              var ninoEncontrado = await funcionesNinos.findNinoByName(nombreNino);
              if(ninoEncontrado == null){
                var ninos = await funcionesNinos.ninoCreate(user.id, nombreNino);
                console.log(ninos);
                var data = {
                  id_nino: ninos.id,
                  id_membresia: 4,
                  sku_membresia: nuevoSku,
                  status: 1,
                  total_dias: 365,
                };

                var ninosMembresias = await funcionesNinos.ninoMembresiaCreate(
                  data
                );

                var data = {
                  id_user_reclamo: user.id,
                  reclamada: 1,
                  id_nino_membresia: ninosMembresias.id,
                  tarjeta_code: tarjetaHoras.tarjeta_code,
                };
                var tarjetaActualizada = await funcionesTarjetasHoras.actualizarTarjeta(
                  data
                );

                var bancoHoras = await funcionesBancoHoras.getBancoHoras(
                  ninosMembresias.sku_membresia
                );
                if (bancoHoras == null) {
                  var data = {
                    id_user: user.id,
                    total_horas: 0,
                    horas_restantes: 0,
                    sku_membresia: nuevoSku,
                    horas_extra: tarjetaHoras.total_horas,
                  };
                  var bancoCreado = await funcionesBancoHoras.crearBancoHoras(
                    data
                  );
                  console.log(bancoCreado);
                } else {
                  var nuevaHoras =
                    parseInt(tarjetaHora.total_horas) +
                    parseInt(bancoHoras.horas_extra);
                  var data = {
                    horas: nuevaHoras,
                    id_bancoHoras: bancoHoras.id,
                  };
                  var bacoActualizado = await funcionesBancoHoras.actualizarBancoHoras(
                    data
                  );
                }
              }else{
                
                var ninosMembresias = await funcionesNinos.findNinoMembresiaById(ninoEncontrado.id)
                var data = {
                  id_user_reclamo: user.id,
                  reclamada: 1,
                  id_nino_membresia: ninosMembresias.id,
                  tarjeta_code: tarjetaHoras.tarjeta_code,
                };
                var tarjetaActualizada = await funcionesTarjetasHoras.actualizarTarjeta(
                  data
                );
                var bancoHoras = await funcionesBancoHoras.getBancoHoras(
                  ninosMembresias.sku_membresia
                );
                if (bancoHoras == null) {
                  console.log("no existe este banco de horas, checar el error")
                }else{
                    var nuevaHoras =
                    parseInt(tarjetaHoras.total_horas) +
                    parseInt(bancoHoras.horas_extra);
                    var data = {
                      horas: nuevaHoras,
                      id_bancoHoras: bancoHoras.id,
                    };
                    var bacoActualizado = await funcionesBancoHoras.actualizarBancoHoras(
                      data
                    );
                }
              }
              
            }
          } else {
            var total_horas = product.horasTotales;
            var tarjetaHoras = await funcionesTarjetasHoras.crearTarjetaDigital(
              codigoTarjeta,
              total_horas,
              user.id,
              0,
              0
            );
          }

          console.log("Se va ejecutar el map para las tarjetas dijitales")
          if(tarjetasD != []){
            tarjetasD.map(async tarjD => {
              console.log("tarjD")
              console.log(tarjD)
              if(tarjD.horas_restantes > 0){
                var reclamada = 0;
              }else{
                var reclamada = 1;
              }
              var datosTar = {
                id_user_reclamo: user.id,
                reclamada: reclamada,
                horas_restantes: tarjD.horas_restantes,
                tarjeta_code: tarjD.codigo
              }
              await funcionesTarjetasHoras.actualizarHorasRestantes(datosTar);
            });
          }
        


          // console.log(tarjetaDigital)
        }
      } else if (product.idTipoProducto == 6) {
        console.log("aqui va 6")
        var ninoUser = await NinosUser.create({
          nombre: item.child_name,
          id_user: user.id,
          horas_globales: 24,
          status: 0,
        });
        var membresia = await Membresia.findOne({
          where: {
            id_producto: product.id,
          },
        });
        var dt = new Date();
        var anio = dt.getYear();
        var valorRandom = await windowGuid2();
        var nuevoSku = membresia.prefijo + anio + valorRandom;
        var fecha_inicio = moment().format();
        var fecha_vencimiento = moment()
          .add(membresia.total_dias, "days")
          .format();
        var ninoMembresia = await NinosMembresia.create({
          id_nino: ninoUser.id,
          id_membresia: membresia.id,
          fecha_inicio: fecha_inicio,
          fecha_vencimiento: fecha_vencimiento,
          sku_membresia: nuevoSku,
          status: 0,
        });
        var datos = {
          id_user: user.id,
          total_horas: membresia.horas_globales,
          horas_restantes: membresia.horas_globales,
          sku_membresia: ninoMembresia.sku_membresia,
          horas_extra: 0,
          deuda_horas: 0,
        };
        
        await funcionesBancoHoras.crearBancoHoras(datos);
        //aqui se actualiza la tarjeta digital
        

      } else if (product.idTipoProducto == 10) {
        console.log("aqui va 10")
        const data = {
          idTicket: ticket.id,
          cartItem: item,
          idProducto: product.id,
        };
        await CarritoRepository.saveShowFromCart(
          data,
          JSON.parse(item.showDetalle)
        );
      } else if (product.idTipoProducto == 9) {
        console.log("aqui va 9")
        var nombreNino = item.child_name;
        var slug = "nuevo-padre";
        var dataPadre = {
          nombre: nombreNino,
          id_user: user.id,
          slug: slug,
          status: 1,
        };
        var padres = await funcionesPadres.createPadreUser(dataPadre);
      } else if(product.idTipoProducto == 8){
        console.log("item.idUsuario")
        console.log(item.idUsuario)
        var arrayCumple = {
          nombre_nino: item.child_name,
          id_usuario_p:  item.idUsuario,
          fecha_cumpleanios: item.fechaCumpleanios,
          hora_cumpleanios: item.horaCumpleanios,
          total_invitados: 0,
          id_producto: item.idProducto
        }
        console.log("arrayCumple")
        console.log(arrayCumple)
        await funcionesCumpleanios.createCumpleanios(arrayCumple)
      }
    });

    await CarritoRepository.destroyAllCart(
      req.body.id_usuario,
      req.body.tipoCarrito
    );
    res.json({
      message: ticket.idTicketSecret,
    });
    // const sessionId = await StripeRepository.getStripeCheckoutSessionIdByCart({
    //   idCarrito: req.body.id_usuario,
    //   items,
    //   userId: user.id,
    //   ticketId: ticket.id,
    //   idTicketSecret
    // });

    // console.log(sessionId);
  } catch (error) {
    console.log(error);
  }
};

function windowGuid2() {
  return "xxxxx-xx4x-yxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
