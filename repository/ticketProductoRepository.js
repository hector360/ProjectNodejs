const TicketProducto = require("../database/models/TicketProducto");
const TicketEspectaculo = require("../database/models/TicketEspectaculos");
const Espectaculo = require("../database/models/Espectaculos");
const Ticket = require("../database/models/Ticket");
const Producto = require("../database/models/Producto");
const Usuarios = require("../database/models/Usuarios");

const boom = require("@hapi/boom");

exports.createTicketProducto = async (data) => {
  return new Promise(async (resolve, reject) => {
    await TicketProducto.create(data).then((tp) => {
      tp ? resolve(tp) : resolve(boom.badData(tp));
    });
  });
};

exports.getTicketInfoById = async (ticketId) => {
  return new Promise(async (resolve, reject) => {
    await Ticket.findOne({
      where: {
        id: ticketId,
      },
      attributes: ["monto", "createdAt"],
      include: [
        {
          model: TicketProducto,
          attributes: ["cantidad", "precio_unitario"],
          include: {
            model: Producto,
            attributes: ["nombreProducto"],
          },
        },
      ],
    }).then((ticket) => {
      ticket ? resolve(ticket) : resolve(boom.badData(ticket));
    });
  });
};

exports.getTicketInfoByStringId = async (ticketId) => {
  Ticket.hasMany(TicketProducto, { foreignKey: "id_ticket" });
  TicketProducto.belongsTo(Ticket, { foreignKey: "id_ticket" });

  Ticket.hasMany(TicketEspectaculo, { foreignKey: "id_ticket" });
  TicketEspectaculo.belongsTo(Ticket, { foreignKey: "id_ticket" });

  Producto.hasMany(TicketProducto, { foreignKey: "id_producto" });
  TicketProducto.belongsTo(Producto, { foreignKey: "id_producto" });

  Espectaculo.hasMany(TicketEspectaculo, { foreignKey: "id_espectaculo" });
  TicketEspectaculo.belongsTo(Espectaculo, { foreignKey: "id_espectaculo" });

  return new Promise(async (resolve, reject) => {
    await Ticket.findOne({
      where: {
        idTicketSecret: ticketId,
      },
      attributes: ["monto", "createdAt"],
      include: [
        {
          model: TicketProducto,
          attributes: ["cantidad", "precio_unitario", "idTalla", "idColor"],
          include: {
            model: Producto,
            attributes: [
              "nombreProducto",
              "urlImagenPost",
              "urlImagenMovil",
              "idTipoProducto",
            ],
          },
        },
        {
          model: TicketEspectaculo,
          attributes: [
            "id_espectaculo",
            "cantidad",
            "precio_unitario",
            "asiento_adultos_r",
            "asiento_ninos_r",
            "asiento_ninos_v",
            "mesa_vip",
            "fecha_espectaculo",
            "hora_espectaculo",
          ],
          include: [
            {
              model: Espectaculo,
              attributes: ["nombre", "urlImagenPost", "urlImagenMovil"]
            }
          ]
        },
      ],
    }).then((ticket) => {
      ticket ? resolve(ticket) : resolve(boom.badData(ticket));
    });
  });
};
