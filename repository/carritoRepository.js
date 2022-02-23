const Carrito = require("../database/models/Carrito");
const Ticket = require("../database/models/Ticket");
const Espectaculo = require("../database/models/Espectaculos");
const Producto = require("../database/models/Producto");
const funcionesGenerador = require("../functions/funcionesGenerador");
const funcionesTicketEspectaculos = require("../functions/funcionesTicketEspectaculos");

const boom = require("@hapi/boom");

exports.checkOut = async ({ idUsuario, tipoCarrito }) => {
  return new Promise((resolve, reject) => {
    Carrito.findAll({
      where: { idUsuario, tipoCarrito },
    }).then((carrito) => {
      if (carrito) {
        resolve(carrito);
      } else {
        resolve(boom.badData());
      }
    });
  });
};
// hola karnal esto es un mensaje para los futuros programadores, bienvenidos a magic planet , la neta cuando empezamos esto estuvo cabron y pues por eso el codigo parece pipi con popo
// pero espero que a ustedes no les parezca pipi con popo, disfruten de este codigo por que la neta ni yo entendi lo que hice, suerte chavos.
//Siganme en Twicth twitch.tv/vectorplays_

exports.destroyCart = async ({ id }) => {
  return new Promise((resolve, reject) => {
    Carrito.destroy({
      where: {
        id: id,
      },
    }).then((resp) => {
      resp ? resolve(resp) : resolve(boom.badData());
    });
  });
};

exports.destroyAllCart = async (idUsuario, tipoCarrito) => {
  await Carrito.destroy({
    where: {
      idUsuario: idUsuario,
      tipoCarrito: tipoCarrito
    },
  })
    .then((carrito) => carrito)
    .catch((error) => {
      console.log(error);
    });
};

exports.createTicket = async ({ usuarioId, nuevoPrecio2, idTicketSecret }) => {
  return new Promise((resolve, reject) => {
    Ticket.create({
      customerTicketId: "",
      usuarioId: usuarioId,
      statusTicket: "NoReclamado",
      monto: nuevoPrecio2,
      faltante: 0,
      estado: "no-liquidado",
      idTicketSecret,
    }).then((ticket) => {
      ticket ? resolve(ticket) : resolve(boom.badData());
    });
  });
};

exports.createTicketSystem = async ({
  usuarioId,
  nuevoPrecio2,
  idTicketSecret,
  customerTicketId,
  estado,
  cuenta_abierta
}) => {
  return new Promise((resolve, reject) => {
    Ticket.create({
      customerTicketId: customerTicketId,
      usuarioId: usuarioId,
      statusTicket: "NoReclamado",
      monto: nuevoPrecio2,
      faltante: 0,
      estado: estado,
      idTicketSecret,
      cuenta_abierta: cuenta_abierta
    }).then((ticket) => {
      ticket ? resolve(ticket) : resolve(boom.badData());
    });
  });
};

exports.checarCarro = async (body) => {
  return await Carrito.findAll({
    where: {
      idProducto: body.idProducto,
      idUsuario: body.idUsuario,
    },
  })
    .then((carrito) => carrito)
    .catch((error) => {
      console.log(error);
    });
};

exports.getCartParams = async (product, body) => {
  console.log(body);
  if (product.idTipoProducto == 10) {
    //Es un espectaculo
    var showDetalle = JSON.parse(body.show_detalles);
    const [productName, productPrice] = await getProductName(
      showDetalle,
      body.idProducto
    );

    return [productName, productPrice];
  } else {
    return false;
  }
};

getProductName = async (showDetails, idProducto) => {
  const _espectaculo = await getEspectaculo(idProducto);

  console.log(showDetails);

  if (showDetails.asiento_adultos_r) {
    return ["Asiento Adulto Regular", _espectaculo.precio_regular];
  } else if (showDetails.asiento_ninos_r) {
    return ["Asiento Niño Regular", _espectaculo.precio_regular];
  } else if (showDetails.asiento_ninos_v) {
    return ["Asiento Niño VIP", _espectaculo.precio_vip];
  } else if (showDetails.mesa_vip) {
    return ["Mesa VIP", _espectaculo.precio_mesa_vip];
  }
};
/* 
const data = {
  customer: req.body.data.object.customer,
  customerTicketId: req.body.id,
  usuarioId: metadata.userId,
  idTipoProducto: product.idTipoProducto,
  idProducto: item.idProducto,
  nombrenino: item.childName,
  idTicket: metadata.ticketId,
  horasTotales: product.idTipoProducto == 7 ? product.horasTotales : 0, 
}
*/

exports.saveShowFromCart = async (data, showDetalle) => {
  const espectaculo = await getEspectaculo(data.idProducto);
  var idTicketProdSecret2 = funcionesGenerador.windowGuid();
  const [espectaculoName, espectaculoPrice] = await getProductName(
    showDetalle,
    data.idProducto
  );

  var ticketExtra = await funcionesTicketEspectaculos.createTicketEspectaculo({
    id_ticket: data.idTicket,
    id_espectaculo: espectaculo.id,
    cantidad: data.cartItem.cantidad,
    precio_unitario: espectaculoPrice,
    idTicketProdSecret: idTicketProdSecret2,
    asiento_adultos_r: showDetalle.asiento_adultos_r ? true : false,
    asiento_ninos_r: showDetalle.asiento_ninos_r ? true : false,
    asiento_ninos_v: showDetalle.asiento_ninos_v ? true : false,
    mesa_vip: showDetalle.mesa_vip ? true : false,
    fecha_espectaculo: showDetalle.fecha_espectaculo,
    hora_espectaculo: showDetalle.hora_espectaculo,
  });

  return ticketExtra;
};
// hola futuros programadores, solo les aviso que las rutas no tienen el auth, asi   que si alguien externo se mete al sistema, fue culpa de esteban , a mi me dio huevita actualizar las rutas (:
exports.updateTicket = async (customerTicketId, idTicket) => {
  return await Ticket.update(
    {
      customerTicketId: customerTicketId,
      estado: "liquidado",
    },
    {
      where: {
        id: idTicket,
      },
    }
  );
}; 

getEspectaculo = async (idproduct) => {
  return new Promise((resolve, reject) => {
    Espectaculo.findOne({
      where: {
        id_producto: idproduct,
      },
    }).then((espectaculo) => {
      espectaculo ? resolve(espectaculo) : reject(espectaculo);
    });
  });
};