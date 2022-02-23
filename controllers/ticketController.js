const {
  getTicketInfoById,
  getTicketInfoByStringId,
} = require("../repository/ticketProductoRepository");
const TicketProducto = require("../database/models/TicketProducto");
const Ticket = require("../database/models/Ticket");
const Usuario = require("../database/models/Usuarios");
const Producto = require("../database/models/Producto");
const moment = require("moment");
const varconfig = require("../variableGlobal/config");

exports.getTicketById2 = async (req, res, next) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await getTicketInfoById(ticketId);

    if (ticket.isBoom) next(ticket);

    const productos = ticket.ticket_productos.map((product, index) => {
      return {
        nombre: product.producto.nombreProducto,
        cantidad: product.cantidad,
        fecha: product.createdAt,
        precio_unitario: product.precio_unitario,
      };
    });

    res.status(200).json({
      status: res.statusCode,
      message: {
        monto: ticket.monto,
        fecha: ticket.createdAt,
        productos,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTicketBySecretId = async (req, res, next) => {
  try {
    const ticket = await getTicketInfoByStringId(req.params.ticket);

    if (ticket.isBoom) next(ticket);

    const ticketProducto = ticket.ticket_productos;
    const ticketEspectaculos = ticket.ticket_espectaculos;

    let ticketItems = [];

    ticketEspectaculos.map((item) => {
      ticketItems.push({
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        idTalla: 0,
        idColor: 0,
        producto: {
          nombreProducto: getSitString(item),
          urlImagenPost: item.espectaculo.urlImagenPost,
          urlImagenMovil: item.espectaculo.urlImagenMovil,
        },
      });
    });

    ticketProducto.map((item) => {
      if (item.producto.idTipoProducto != 10) {
        ticketItems.push({
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          idTalla: item.idTalla,
          idColor: item.idColor,
          producto: {
            nombreProducto: item.producto.nombreProducto,
            urlImagenPost: item.producto.urlImagenPost,
            urlImagenMovil: item.producto.urlImagenMovil,
          },
        });
      }
    });

    res.status(200).json({
      status: res.statusCode,
      message: {
        monto: ticket.monto,
        createdAt: ticket.createdAt,
        ticket_productos: ticketItems,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

getSitString = (item) => {
  if (item.asiento_adultos_r) {
    return "Asiento Adulto Regular";
  } else if (item.asiento_ninos_r) {
    return "Asiento Niño Regular";
  } else if (item.asiento_ninos_v) {
    return "Asiento Niño VIP";
  } else if (item.mesa_vip) {
    return "Mesa VIP";
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    const ticketProductoId = req.params.ticketId;
    await TicketProducto.findAll({
      where: {
        idTicketProdSecret: ticketProductoId,
      },
    })
      .then(async (tiketProd) => {
        // console.log(tiketProd[0].dataValues)
        // res.json(tiketProd)
        console.log("ticket[0].dataValues.usuarioId");
        console.log(tiketProd[0].dataValues.id_ticket);
        await Ticket.findAll({
          where: {
            id: tiketProd[0].dataValues.id_ticket,
          },
        })
          .then(async (ticket) => {
            console.log(ticket);
            console.log("ticket[0].dataValues.usuarioId");
            console.log(ticket[0].dataValues.usuarioId);
            await Usuario.findAll({
              where: {
                id: ticket[0].dataValues.usuarioId,
              },
            })
              .then(async (usuario) => {
                console.log(usuario);
                await Producto.findAll({
                  where: {
                    id: tiketProd[0].dataValues.id_producto,
                  },
                }).then((producto) => {
                  console.log(producto);

                  // var year = fecha.getFullYear();
                  // var month = fecha.getMonth();
                  var fecha = new Date(ticket[0].dataValues.createdAt);
                  var year = fecha.getFullYear();
                  var month = fecha.getMonth();
                  var day = fecha.getDay();
                  month = month + 1;
                  // let nuevaFecha = fecha.split("T");
                  var fechaFinal = day + "/" + month + "/" + year;
                  // console.log("la fecha")
                  // console.log(day);
                  var nombreCompleto =
                    usuario[0].nombres + " " + usuario[0].apellidos;
                  res.status(200).json({
                    status: res.statusCode,
                    message: {
                      monto: ticket[0].dataValues.monto,
                      fecha: fechaFinal,
                      producto: producto[0].dataValues.nombreProducto,
                      usuario: nombreCompleto,
                      tiketProd: tiketProd[0].dataValues.idTicketProdSecret,
                    },
                  });
                });
              })
              .catch((error) => {
                console.log(error);
                console.log("error al buscar el usuario");
              });
          })
          .catch((error) => {
            console.log("error al buscar el ticket");
            console.log(error);
          });
      })
      .catch((error) => {
        // console.log("error al buscar el ticketProducto")
        console.log(error);
      });
  } catch (err) {
    next(err);
  }
};

exports.getTicketPdf = async (req, res, next) => {
  try {
    const ticket = await getTicketInfoByStringId(req.params.ticket);

    if (ticket.isBoom) next(ticket);

    const ticketProducto = ticket.ticket_productos;
    const ticketEspectaculos = ticket.ticket_espectaculos;

    let ticketItems = [];

    ticketEspectaculos.map((item) => {
      ticketItems.push({
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        idTalla: 0,
        idColor: 0,
        producto: {
          nombreProducto: getSitString(item),
          urlImagenPost: item.espectaculo.urlImagenPost,
          urlImagenMovil: item.espectaculo.urlImagenMovil,
        },
      });
    });

    ticketProducto.map((item) => {
      if (item.producto.idTipoProducto != 10) {
        ticketItems.push({
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          idTalla: item.idTalla,
          idColor: item.idColor,
          producto: {
            nombreProducto: item.producto.nombreProducto,
            urlImagenPost: item.producto.urlImagenPost,
            urlImagenMovil: item.producto.urlImagenMovil,
          },
        });
      }
    });

    const pdf = require('html-pdf');

    var content = `
      <div class="ticket" style="width:320px;min-height:600px;background:#fff">
        <img src="${varconfig.URLMAGICCRM}/img/header-ticket.jpeg" style="width:320px">
        <div class="ticket-body" style="padding:0px 20px">
          <table class="table">
            <tr style="background:#d6d6d6;padding:3px;margin-bottom:20px">
              <td style="padding:4px">Fecha:</td>
              <td style="text-align:right;padding:4px">${ticket.createdAt}</td>
            </tr>
    `;
    ticketItems.map(ticket =>{
      content += `
        <tr style="background:#d6d6d6;padding:3px;margin-bottom:5px">
          <td style="padding:4px">Producto:</td>
          <td style="text-align:right;padding:4px">${ticket.producto.nombreProducto}</td>
        </tr>
        <tr style="background:#d6d6d6;padding:3px;margin-bottom:5px">
          <td style="padding:4px">Cantidad:</td>
          <td style="text-align:right;padding:4px">${ticket.cantidad}</td>
        </tr>
        <tr style="background:#d6d6d6;padding:3px;margin-bottom:10px">
          <td style="padding:4px">Precio:</td>
          <td style="text-align:right;padding:4px">$ ${ticket.precio_unitario} mxn</td>
        </tr>
        <tr><td style="height:20px"></td><td></td></tr>
      `;
    });
    content += `
        <tr style="background:#d6d6d6;padding:3px;">
          <td style="padding:4px"><strong>Total:</strong></td>
          <td style="text-align:right"><strong>$ ${ticket.monto} mxn</strong></td>
        </tr>
        </table>
      </div>
      <img src="${varconfig.URLMAGICCRM}/img/footer-ticket.jpeg" style="width:320px">
    </div>`;
    var ruta= `${varconfig.URLMAGICCRM}/tickets/ticket-${req.params.ticket}.pdf`;

    pdf.create(content).toFile(`./public/tickets/ticket-${req.params.ticket}.pdf`, function(err, res) {
        if (err){
            console.log(err);
        } else {
            console.log(res);
        }
    });

    res.status(200).json({
      status: res.statusCode,
      message: {
        rutaPdf: ruta,
        createdAt: ticket.createdAt,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

exports.sendWhatsappTicket = async (req, res, next) => {
  try {
    var axios = require('axios');
    var data = JSON.stringify({
      "to_number": `521${req.body.numberPhone}`,
      "type": "media",
      "message": `${req.body.urlTicket}`,
      "text": "Recibo de compra Club Magic Planet"
    });

    var config = {
      method: 'post',
      url: 'https://api.maytapi.com/api/a55304af-ef20-45c4-87c1-c752e7e61283/5119/sendMessage',
      headers: { 
        'x-maytapi-key': 'f64cdb65-c8a5-4356-a1f9-270c31846f6b', 
        'Content-Type': 'application/json', 
        'Cookie': '__cfduid=d504dbf779e0e0eef1ab8e25262336b581620400857'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      res.status(200).json(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }catch(e){
    next();
  }
}