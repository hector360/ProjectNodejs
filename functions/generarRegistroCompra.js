//Programadores del futuro solo quiero decirles que esto no lo quisimos dejar asi, las circustancias que nos rodearon nos hicieron dejarlo así, suerte y que eren los proteja
const Ticket = require("../database/models/Ticket");
const NinosUser = require("../database/models/NinosUser");
const Membresia = require("../database/models/Membresia");
const NinosMembresia = require("../database/models/NinosMembresia");
const TarjetasDigitales = require("../database/models/TarjetasDigitales");
const {
  createTicketProducto,
} = require("../repository/ticketProductoRepository");
const funcionesBancoHoras = require("../functions/funcionesBancoHoras");
const Usuario = require("../database/models/Usuarios");
const moment = require("moment");

exports.generarRegistroCompra = async (response, carrito = false) => {
  // console.log("entramos al generar registro compra")
  // console.log("metadata")
  // console.log(response.data.object.metadata)
  // console.log("customerId")
  // console.log(response.data.object.customer)

  if (carrito) {
    var customer = response.customer;
    var customerTicketId = response.customerTicketId;
    var usuarioId = response.usuarioId;
    var idTipoProducto = response.idTipoProducto;
    var idProducto = response.idProducto;
    var nombrenino = response.nombrenino;
    var idTicket = response.idTicket;
    var horasTotales = response.horasTotales;
  } else {
    var customer = response.data.object.customer;
    var customerTicketId = response.id;
    var usuarioId = response.data.object.metadata.usuarioId;
    var montoPagar = response.data.object.metadata.montoPagar;
    var faltante = response.data.object.metadata.faltante;
    var idTipoProducto = response.data.object.metadata.idTipoProducto;
    var idProducto = response.data.object.metadata.idProducto;
    var precio_unitario = response.data.object.metadata.precio_unitario;
    var nombrenino = response.data.object.metadata.nombrenino;
    var idTicket = response.data.object.metadata.idTicket;
    var horasTotales = response.data.object.metadata.horasTotales;
  }
  console.log("customer: ");
  console.log(customer);
  // console.log("pagoAdelantado");
  // console.log(pagoAdelantado)
  // if(cantidadPago == "pagototal"){
  //     var faltante = 0;
  //     var montoPagar = precio;
  // }else if(cantidadPago == "pagaradelanto"){
  //     var faltante = precio - pagoAdelantado;
  //     var montoPagar = pagoAdelantado;
  // }

  // return await Ticket.create({
  //     customerId: customer,
  //     usuarioId: usuarioId,
  //     statusTicket: "NoReclamado",
  //     monto: montoPagar,
  //     faltante: faltante,
  // }).then(async ticket =>{
  // console.log(ticket.dataValues.id)

  if (idTipoProducto != 7 && idTipoProducto != 6) {
    console.log("webhook de los productos");
    //aqui se actualiza el ticket
    await Ticket.update(
      {
        customerTicketId: customerTicketId,
        estado: "liquidado",
      },
      {
        where: {
          id: idTicket,
        },
      }
    )
      .then(async (ticket) => {
        console.log("se actualizo el ticket");
        await Usuario.findOne({
          where: {
            id: usuarioId,
          },
        })
          .then(async (usuarioEncontrado) => {
            console.log("usuarioEncontrado.customerId");
            console.log(usuarioEncontrado.customerId);
            if (usuarioEncontrado.customerId == null) {
              await Usuario.update(
                {
                  customerId: customer,
                },
                {
                  where: {
                    id: usuarioId,
                  },
                }
              )
                .then((usuario) => {
                  console.log(usuario);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log("error al actualizar el ticket");
        console.log(error);
      });
  } else {
    console.log("webhook de las membresias y horas");
    // return await NinosUser.create({
    //     nombre: nombrenino,
    //     id_user: usuarioId,
    //     horas_globales: 0,
    //     status: 0,

    // }).then(async ninoUser => {

    // console.log(ninoUser.dataValues.id)
    // console.log(producto[0].dataValues.id)
    // console.log(producto[0].dataValues.idTipoProducto)
    if (idTipoProducto == 7) {
      var nuevoIdProducto = 63;
    } else {
      var nuevoIdProducto = idProducto;
    }
    console.log(nuevoIdProducto);
    return await Membresia.findAll({
      where: {
        id_producto: nuevoIdProducto,
      },
    })
      .then(async (membresia) => {
        // console.log(membresia)
        var dt = new Date();
        var anio = moment().format("YYYY");
        var valorRandom = nombrenino[0] + nombrenino[1] + windowGuid2();
        var nuevoSku =
          membresia[0].dataValues.prefijo +
          anio +
          valorRandom +
          membresia[0].dataValues.id;

        console.log(membresia[0].dataValues.prefijo);
        console.log(anio);
        console.log(valorRandom);
        if (membresia[0].id == 4) {
          // TarjetasDigitales
          console.log("intentaste comprar unas horas");

          let fecha = new Date();
          let codigoTarjeta = "TD-" + fecha.getFullYear() + fecha.getMonth();
          let codigoAleatorio = await windowGuid();
          codigoTarjeta = codigoTarjeta + codigoAleatorio;
          await TarjetasDigitales.create({
            tarjeta_code: codigoTarjeta,
            total_horas: horasTotales,
            id_user: usuarioId,
            reclamada: false,
            horas_restantes: horasTotales,
          }).then(async (tarjetasDigitales) => {
            console.log("se creo la tarjeta digital");
            await Ticket.update(
              {
                customerTicketId: customerTicketId,
                estado: "liquidado",
              },
              {
                where: {
                  id: idTicket,
                },
              }
            )
              .then(async (ticket) => {
                console.log("se actualizo el ticket");
                await Usuario.findOne({
                  where: {
                    id: usuarioId,
                  },
                })
                  .then(async (usuarioEncontrado) => {
                    console.log("usuarioEncontrado.customerId");
                    console.log(usuarioEncontrado.customerId);
                    if (usuarioEncontrado.customerId == null) {
                      await Usuario.update(
                        {
                          customerId: customer,
                        },
                        {
                          where: {
                            id: usuarioId,
                          },
                        }
                      )
                        .then((usuario) => {
                          console.log(usuario);
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log("error al actualizar el ticket");
                console.log(error);
              });
          });
        } else {
          await crearNinosTablas(
            nombrenino,
            usuarioId,
            membresia[0].dataValues.id,
            nuevoSku.toUpperCase(),
            idTicket,
            customer,
            customerTicketId,
            membresia[0].dataValues.total_dias
          );
        }
      })
      .catch((error) => {
        console.log("error en menbresia");
        console.log(error);
      });

    // }).catch(error => {
    //     console.log("fallo el niño user");
    // })
  }

  // }).catch(error => {
  //         console.log(error)
  // });
};

async function crearNinosTablas(
  nombrenino,
  usuarioId,
  idMembresia,
  nuevoSku,
  idTicket,
  customer,
  customerTicketId,
  total_dias
) {
  console.log(nombrenino);
  return await NinosUser.create({
    nombre: nombrenino,
    id_user: usuarioId,
    horas_globales: 24,
    status: 0,
  })
    .then(async (ninoUser) => {
      var fecha_inicio = moment().format();
      var fecha_vencimiento = moment().add(total_dias, "days").format();
      return await NinosMembresia.create({
        id_nino: ninoUser.dataValues.id,
        id_membresia: idMembresia,
        fecha_inicio: fecha_inicio,
        fecha_vencimiento: fecha_vencimiento,
        sku_membresia: nuevoSku,
        status: 0,
      })
        .then(async (ninoMembresia) => {
          //aqui se actualiza el ticket
          await Membresia.findOne({
            where: {
              id: idMembresia,
            },
          })
            .then(async (membresia) => {
              var datos = {
                id_user: usuarioId,
                total_horas: membresia.horas_globales,
                horas_restantes: membresia.horas_globales,
                sku_membresia: ninoMembresia.sku_membresia,
                horas_extra: 0,
                deuda_horas: 0,
              };
              await funcionesBancoHoras
                .crearBancoHoras(datos)
                .then(async (bancoHora) => {
                  console.log("se creo correctamente el niño membresia");
                  await Ticket.update(
                    {
                      customerTicketId: customerTicketId,
                      estado: "liquidado",
                    },
                    {
                      where: {
                        id: idTicket,
                      },
                    }
                  )
                    .then(async (ticket) => {
                      console.log("se actualizo el ticket");
                      await Usuario.findOne({
                        where: {
                          id: usuarioId,
                        },
                      })
                        .then(async (usuarioEncontrado) => {
                          console.log("usuarioEncontrado.customerId");
                          console.log(usuarioEncontrado.customerId);
                          if (usuarioEncontrado.customerId == null) {
                            await Usuario.update(
                              {
                                customerId: customer,
                              },
                              {
                                where: {
                                  id: usuarioId,
                                },
                              }
                            )
                              .then((usuario) => {
                                console.log(usuario);
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    })
                    .catch((error) => {
                      console.log("error al actualizar el ticket");
                      console.log(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log("error al crear niño membresia");
          console.log(error);
        });
    })
    .catch((error) => {
      console.log("fallo el niño user");
    });
}

function windowGuid() {
  return "xxx-xxx-4xx-yx-xxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function windowGuid2() {
  return "xyxy".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function pad_with_zeroes(number, length) {
  var my_string = "" + number;
  while (my_string.length < length) {
    my_string = "0" + my_string;
  }

  return my_string;
}
